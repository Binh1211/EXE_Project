import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/auth-api";
import { saveAuthSession } from "@/features/auth/lib/auth-session";
import type { AuthUser } from "@/features/auth/types";

/**
 * Trang callback sau khi BE xử lý Google OAuth và redirect về FE.
 * Query: ?access_token=...&user=... hoặc ?error=...
 */
export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    async function finishGoogleAuth() {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");
      const errorMessage = params.get("error");

      if (errorMessage) {
        setError(decodeURIComponent(errorMessage));
        return;
      }

      if (!accessToken) {
        setError("Không nhận được token từ server.");
        return;
      }

      let user: AuthUser | null = null;
      const userParam = params.get("user");
      if (userParam) {
        try {
          user = JSON.parse(decodeURIComponent(userParam)) as AuthUser;
        } catch {
          setError("Dữ liệu người dùng không hợp lệ.");
          return;
        }
      }

      saveAuthSession({
        accessToken,
        user: user ?? { id: "", email: "", fullName: "" },
      });

      if (!user?.id) {
        try {
          user = await authApi.getMe();
          saveAuthSession({ accessToken, user });
        } catch {
          setError("Không lấy được thông tin người dùng.");
          return;
        }
      }

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }

    void finishGoogleAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf0ce] px-4 font-sans">
      <div className="rounded-2xl bg-white p-6 text-center shadow-lg">
        {error ? (
          <>
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="mt-4 rounded-xl bg-[#5f3713] px-4 py-2 text-sm font-bold text-white"
            >
              Quay lại đăng nhập
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-600">Đang xử lý đăng nhập Google...</p>
        )}
      </div>
    </div>
  );
}
