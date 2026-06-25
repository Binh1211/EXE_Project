import { useEffect, useState } from "react";
import { adminApi, getApiErrorMessage, type AdminUser } from "../api/admin-api";
import { Users, Shield, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-client";
import {
  AdminBadge,
  AdminCard,
  AdminCardHeader,
  AdminEmpty,
  AdminErrorBox,
  AdminGhostBtn,
  AdminLoading,
  adminSelect,
} from "./admin-ui";

function avatarSrc(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
}

export function UserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    setError("");
    adminApi
      .getUsers()
      .then(setUsers)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole?: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Đổi quyền thành ${newRole === "admin" ? "Quản trị viên" : "Người dùng"}?`)) return;
    try {
      await adminApi.updateUser(userId, { role: newRole as "admin" | "user" });
      fetchUsers();
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  const handleLevelChange = async (userId: string, newLevel: number) => {
    try {
      await adminApi.updateUser(userId, { level: newLevel as 1 | 2 | 3 });
      fetchUsers();
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  const regularUsers = users.filter((u) => u.role !== "admin");
  const adminCount = users.length - regularUsers.length;
  const vipCount = regularUsers.filter((u) => (u.level ?? 1) >= 2).length;

  return (
    <AdminCard>
      <AdminCardHeader
        icon={Users}
        title="Quản lý người dùng"
        subtitle="Phân quyền admin · Cấp VIP chỉ áp dụng cho user"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminBadge>Tổng: {users.length}</AdminBadge>
            <AdminBadge variant="success">VIP+ (user): {vipCount}</AdminBadge>
            <AdminGhostBtn onClick={fetchUsers}>
              <RefreshCw className="h-3.5 w-3.5" />
              Tải lại
            </AdminGhostBtn>
          </div>
        }
      />

      {error && <AdminErrorBox message={error} />}

      {loading ? (
        <AdminLoading label="Đang tải danh sách người dùng..." />
      ) : users.length === 0 ? (
        <AdminEmpty title="Chưa có người dùng" description="Dữ liệu sẽ hiển thị khi có đăng ký mới." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-black/5 bg-[#fff3e9]/60 text-[11px] font-semibold uppercase tracking-wider text-[#5f3713]">
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Cấp VIP</th>
                <th className="px-6 py-4">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((user) => {
                const src = avatarSrc(user.avatarUrl);
                const isAdmin = user.role === "admin";
                return (
                  <tr
                    key={user._id}
                    className="transition hover:bg-[#fff3e9]/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {src ? (
                          <img
                            src={src}
                            alt=""
                            className="h-11 w-11 rounded-full border-2 border-[#e8d5c4] object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5f3713] text-sm font-bold text-white">
                            {(user.displayName || user.fullName || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {user.displayName || user.fullName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                          user.role === "admin"
                            ? "border-red-200 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100"
                            : "border-black/10 bg-white text-gray-600 hover:border-[#5f3713]/50 hover:text-[#5f3713]"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {user.role === "admin" ? "Admin" : "User"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <span className="text-xs italic text-gray-400">—</span>
                      ) : (
                        <select
                          className={`${adminSelect} w-28 py-1.5`}
                          value={user.level ?? 1}
                          onChange={(e) =>
                            handleLevelChange(user._id, Number(e.target.value))
                          }
                        >
                          <option value={1}>Level 1</option>
                          <option value={2}>Level 2</option>
                          <option value={3}>Level 3</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="border-t border-black/5 bg-[#fff3e9]/30 px-6 py-3 text-xs text-gray-500">
          {adminCount} quản trị viên · {regularUsers.length} người dùng thường
          {regularUsers.length > 0 && ` · ${vipCount} có VIP (level 2+)`}
        </div>
      )}
    </AdminCard>
  );
}
