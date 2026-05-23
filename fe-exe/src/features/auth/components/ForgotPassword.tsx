import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      setSuccess(
        res.message ||
          "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.",
      );
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Quên mật khẩu"
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
        Nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email.
      </p>

      <AuthAlert type="error" message={error} />
      <AuthAlert type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className={authFieldClass}>
          <label className={authLabelClass}>Email</label>
          <input
            type="email"
            placeholder="Example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            "Gửi email đặt lại mật khẩu"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
