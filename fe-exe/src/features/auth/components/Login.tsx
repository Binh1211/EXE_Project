import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  authApi,
  getAuthErrorMessage,
  saveAuthSession,
} from "@/features/auth/api/auth-api";
import GoogleAuthButton from "@/features/auth/components/GoogleAuthButton";

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
      const response = await authApi.login({ email, password });
      saveAuthSession(response);
      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = "flex flex-col gap-1";
  const labelClass = "text-xs leading-none text-gray-500";
  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#5f3713] focus:bg-white";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/img/paper-texture.png')] bg-cover bg-center bg-[#fbf0ce] px-4 py-8 font-sans selection:bg-[#5f3713] selection:text-white">
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="mb-4 overflow-hidden rounded-xl">
          <img
            src="/img/login_banner.png"
            alt="Cổng Hoàng Thành Huế"
            className="h-[130px] w-full object-cover"
          />
        </div>

        <h2 className="mb-4 font-history text-2xl font-bold text-gray-900">
          Đăng Nhập
        </h2>

        {error && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 p-2.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className={fieldClass}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="Example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              disabled={isLoading}
            />
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>Mật khẩu</label>
            <input
              type="password"
              placeholder="Ít nhất 8 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
              disabled={isLoading}
            />
            <div className="flex justify-end pt-0.5">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Tính năng quên mật khẩu đang được phát triển!");
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#5f3713] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#4d2c0f] disabled:opacity-70"
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

        <GoogleAuthButton
          mode="login"
          label="Google"
          disabled={isLoading}
        />

        <p className="mt-5 text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#5f3713] hover:underline"
          >
            Đăng ký ngay!
          </Link>
        </p>

        <p className="mt-4 text-center text-[10px] tracking-wide text-gray-400">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}
