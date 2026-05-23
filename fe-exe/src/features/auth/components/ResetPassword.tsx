import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi, getAuthErrorMessage } from "@/features/auth/api/auth-api";
import AuthAlert from "@/features/auth/components/AuthAlert";
import AuthCard from "@/features/auth/components/AuthCard";
import {
  AUTH_ROUTES,
  authFieldClass,
  authInputClass,
  authLabelClass,
  authPrimaryBtnClass,
} from "@/features/auth/constants";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải chứa ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, password });
      setSuccess(res.message || "Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate(AUTH_ROUTES.login), 1500);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthCard title="Đặt lại mật khẩu">
        <AuthAlert
          type="error"
          message="Link không hợp lệ. Vui lòng yêu cầu gửi lại email."
        />
        <Link
          to={AUTH_ROUTES.forgotPassword}
          className="mt-4 block text-center text-sm font-semibold text-[#5f3713] hover:underline"
        >
          Gửi lại email
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Đặt lại mật khẩu"
      bannerSrc="/img/login_banner.png"
      bannerAlt="Cổng Hoàng Thành Huế"
      footer={
        <p className="mt-5 text-center text-sm text-gray-500">
          <Link
            to={AUTH_ROUTES.login}
            className="font-semibold text-[#5f3713] hover:underline"
          >
            Quay lại đăng nhập
          </Link>
        </p>
      }
    >
      <p className="mb-4 text-sm text-gray-600">
        Nhập mật khẩu mới cho tài khoản của bạn.
      </p>

      <AuthAlert type="error" message={error} />
      <AuthAlert type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className={authFieldClass}>
          <label className={authLabelClass}>Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Ít nhất 8 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            required
            disabled={isLoading}
          />
        </div>

        <div className={authFieldClass}>
          <label className={authLabelClass}>Xác nhận mật khẩu</label>
          <input
            type="password"
            placeholder="Ít nhất 8 ký tự"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={authInputClass}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={authPrimaryBtnClass}
        >
          {isLoading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Cập nhật mật khẩu"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
