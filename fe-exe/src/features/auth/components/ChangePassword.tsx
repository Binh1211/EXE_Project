import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi, getAuthErrorMessage } from "@/features/auth/api/auth-api";
import AuthAlert from "@/features/auth/components/AuthAlert";
import {
  AUTH_ROUTES,
  authFieldClass,
  authInputClass,
  authLabelClass,
  authPrimaryBtnClass,
  authSecondaryBtnClass,
} from "@/features/auth/constants";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải chứa ít nhất 8 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setSuccess(res.message || "Đổi mật khẩu thành công!");
      setTimeout(() => navigate(AUTH_ROUTES.profile), 1500);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 font-sans">
      <Link
        to={AUTH_ROUTES.profile}
        className="mb-4 inline-block text-sm text-[#5f3713] hover:underline"
      >
        ← Quay lại hồ sơ
      </Link>

      <h1 className="mb-2 font-history text-3xl font-bold text-[#5f3713]">
        Đổi mật khẩu
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Nhập mật khẩu hiện tại và mật khẩu mới.
      </p>

      <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <AuthAlert type="error" message={error} />
        <AuthAlert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={authFieldClass}>
            <label className={authLabelClass}>Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={authInputClass}
              required
              disabled={isLoading}
            />
          </div>

          <div className={authFieldClass}>
            <label className={authLabelClass}>Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Ít nhất 8 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={authInputClass}
              required
              disabled={isLoading}
            />
          </div>

          <div className={authFieldClass}>
            <label className={authLabelClass}>Xác nhận mật khẩu mới</label>
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
            {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>

          <Link
            to={AUTH_ROUTES.profile}
            className={`${authSecondaryBtnClass} block text-center`}
          >
            Hủy
          </Link>
        </form>
      </div>
    </div>
  );
}
