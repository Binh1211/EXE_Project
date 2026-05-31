import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuthErrorMessage,
  registerAndSave,
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
import { IMG } from "@/lib/images";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
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
      await registerAndSave({ fullName, email, password });
      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Tạo tài khoản"
      bannerSrc={IMG.registerBanner}
      bannerAlt="Lối đi Hoàng Thành Huế"
      footer={
        <p className="mt-5 text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <Link
            to={AUTH_ROUTES.login}
            className="font-semibold text-[#5f3713] hover:underline"
          >
            Đăng nhập ngay!
          </Link>
        </p>
      }
    >
      <AuthAlert type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className={authFieldClass}>
          <label className={authLabelClass}>Họ và tên</label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={authInputClass}
            required
            disabled={isLoading}
          />
        </div>

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
            "Đăng ký"
          )}
        </button>
      </form>

      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-gray-400">
          Hoặc đăng ký qua
        </span>
      </div>

      <GoogleAuthButton mode="register" disabled={isLoading} />
    </AuthCard>
  );
}
