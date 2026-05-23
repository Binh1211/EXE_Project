import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuthErrorMessage,
  loginAndSave,
} from "@/features/auth/api/auth-api";
import AuthAlert from "@/features/auth/components/AuthAlert";
import AuthCard from "@/features/auth/components/AuthCard";
import GoogleAuthButton from "@/features/auth/components/GoogleAuthButton";
import {
  AUTH_ROUTES,
  authFieldClass,
  authInputClass,
  authLabelClass,
  authPrimaryBtnClass,
} from "@/features/auth/constants";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setIsLoading(true);
    try {
      await loginAndSave({ email, password });
      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Đăng Nhập"
      bannerSrc="/img/login_banner.png"
      bannerAlt="Cổng Hoàng Thành Huế"
      footer={
        <p className="mt-5 text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link
            to={AUTH_ROUTES.register}
            className="font-semibold text-[#5f3713] hover:underline"
          >
            Đăng ký ngay!
          </Link>
        </p>
      }
    >
      <AuthAlert type="error" message={error} />

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

        <div className={authFieldClass}>
          <label className={authLabelClass}>Mật khẩu</label>
          <input
            type="password"
            placeholder="Ít nhất 8 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            required
            disabled={isLoading}
          />
          <div className="flex justify-end pt-0.5">
            <Link
              to={AUTH_ROUTES.forgotPassword}
              className="text-xs text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={authPrimaryBtnClass}
        >
          {isLoading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-gray-400">
          Hoặc đăng nhập qua
        </span>
      </div>

      <GoogleAuthButton mode="login" label="Google" disabled={isLoading} />
    </AuthCard>
  );
}
