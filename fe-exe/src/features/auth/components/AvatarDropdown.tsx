import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Upload } from "lucide-react";
import { authApi } from "@/features/auth/api/auth-api";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { clearAuthSession, getStoredUser } from "@/features/auth/lib/auth-session";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { API_BASE_URL } from "@/lib/api-client";

export default function AvatarDropdown() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const stored = getStoredUser();
  const rawAvatarUrl = user?.avatarUrl || stored?.avatarUrl;
  // Construct full URL if it's a relative path
  const avatarUrl = rawAvatarUrl?.startsWith("http")
    ? rawAvatarUrl
    : rawAvatarUrl
      ? `${API_BASE_URL}${rawAvatarUrl}`
      : undefined;
  const displayName = user?.fullName || stored?.fullName || "User";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // BE chưa có endpoint logout vẫn xóa session local
    } finally {
      clearAuthSession();
      navigate(AUTH_ROUTES.login);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#f3e2d3] transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#5f3713] flex items-center justify-center text-white text-xs font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-[#5f3713] max-w-[120px] truncate hidden sm:inline">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[300] mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {/* Profile section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500">Tài khoản</p>
            <p className="text-sm font-semibold text-[#5f3713] truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          {/* Menu items */}
          <button
            onClick={() => {
              navigate(AUTH_ROUTES.profile);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#5f3713] hover:bg-[#f9f5ed] transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Chỉnh sửa hồ sơ</span>
          </button>

          <button
            onClick={() => {
              navigate(AUTH_ROUTES.changePassword);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#5f3713] hover:bg-[#f9f5ed] transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Đổi mật khẩu</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}
