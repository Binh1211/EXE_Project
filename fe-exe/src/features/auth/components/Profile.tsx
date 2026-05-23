import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  authApi,
  getAuthErrorMessage,
  updateProfileAndSave,
} from "@/features/auth/api/auth-api";
import { getStoredUser } from "@/features/auth/lib/auth-session";
import AuthAlert from "@/features/auth/components/AuthAlert";
import {
  AUTH_ROUTES,
  authFieldClass,
  authInputClass,
  authLabelClass,
  authPrimaryBtnClass,
  authSecondaryBtnClass,
} from "@/features/auth/constants";
import { Upload } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-client";

export default function Profile() {
  const stored = getStoredUser();
  const [fullName, setFullName] = useState(stored?.fullName ?? "");
  const [email, setEmail] = useState(stored?.email ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  // Store raw avatar URL, handle full URL construction on display
  const [avatarPreview, setAvatarPreview] = useState<string>(
    stored?.avatarUrl?.startsWith("http")
      ? stored.avatarUrl
      : stored?.avatarUrl
        ? `${API_BASE_URL}${stored.avatarUrl}`
        : ""
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const user = await authApi.getMe();
        if (!cancelled) {
          setFullName(user.fullName);
          setEmail(user.email);
          if (user.avatarUrl) {
            const fullUrl = user.avatarUrl.startsWith("http")
              ? user.avatarUrl
              : `${API_BASE_URL}${user.avatarUrl}`;
            setAvatarPreview(fullUrl);
          }
        }
      } catch {
        // Dùng dữ liệu local khi BE chưa sẵn sàng
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn một file ảnh");
        return;
      }

      setAvatarFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Họ và tên không được để trống.");
      return;
    }

    setIsLoading(true);
    try {
      // Upload avatar if changed
      if (avatarFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
        const base64Avatar = await base64Promise;
        const updatedUser = await authApi.uploadAvatar(base64Avatar);
        // Construct full URL if it's a relative path
        if (updatedUser.avatarUrl) {
          const fullUrl = updatedUser.avatarUrl.startsWith("http")
            ? updatedUser.avatarUrl
            : `${API_BASE_URL}${updatedUser.avatarUrl}`;
          setAvatarPreview(fullUrl);
        }
        setAvatarFile(null);
      }

      // Update profile
      await updateProfileAndSave({ fullName: fullName.trim() });
      setSuccess("Cập nhật hồ sơ thành công!");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 font-sans">
      <h1 className="mb-2 font-history text-3xl font-bold text-[#5f3713]">
        Hồ sơ cá nhân
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Quản lý thông tin tài khoản của bạn.
      </p>

      <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <AuthAlert type="error" message={error} />
        <AuthAlert type="success" message={success} />

        {isFetching ? (
          <p className="text-sm text-gray-500">Đang tải thông tin...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#5f3713]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#5f3713] flex items-center justify-center text-white text-2xl font-bold">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label htmlFor="avatar" className={authSecondaryBtnClass}>
                <Upload className="w-4 h-4 inline mr-2" />
                {avatarFile ? "Đã chọn hình" : "Thay đổi ảnh đại diện"}
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isLoading}
              />
              <p className="text-[10px] text-gray-400 mt-2">
                Dung lượng tối đa: 5MB
              </p>
            </div>

            <div className={authFieldClass}>
              <label className={authLabelClass}>Họ và tên</label>
              <input
                type="text"
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
                value={email}
                className={`${authInputClass} cursor-not-allowed bg-gray-50`}
                readOnly
                disabled
              />
              <p className="text-[10px] text-gray-400">
                Email không thể thay đổi tại đây.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={authPrimaryBtnClass}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-gray-100 pt-6">
          <Link
            to={AUTH_ROUTES.changePassword}
            className={`${authSecondaryBtnClass} block text-center`}
          >
            Đổi mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
}
