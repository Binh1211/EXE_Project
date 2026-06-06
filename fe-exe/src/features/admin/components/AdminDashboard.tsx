import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserTable } from "./UserTable";
import { ContentEditor } from "./ContentEditor";
import { RevenueChart } from "./RevenueChart";
import {
  Shield,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { authApi } from "@/features/auth/api/auth-api";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { clearAuthSession, getStoredUser } from "@/features/auth/lib/auth-session";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { IMG } from "@/lib/images";

type Tab = "users" | "content" | "revenue";

const navItems: { id: Tab; label: string; desc: string; icon: typeof Users }[] = [
  { id: "revenue", label: "Doanh thu", desc: "Thống kê thanh toán", icon: BarChart3 },
  { id: "users", label: "Người dùng", desc: "Quản lý tài khoản", icon: Users },
  { id: "content", label: "Nội dung", desc: "Timeline · Khóa học · Bài giảng", icon: BookOpen },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const stored = getStoredUser();
  const displayName = user?.fullName || stored?.fullName || "Admin";
  const email = user?.email || stored?.email || "";

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* clear local anyway */
    } finally {
      clearAuthSession();
      navigate(AUTH_ROUTES.login);
    }
  };

  const ActiveIcon = navItems.find((n) => n.id === activeTab)?.icon ?? LayoutDashboard;

  return (
    <div
      className="min-h-screen font-history text-gray-800"
      style={{ backgroundImage: `url(${IMG.paperTexture})`, backgroundSize: "cover" }}
    >
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-black/5 bg-[#fbf0ce]/95 backdrop-blur-sm lg:flex">
          <div className="border-b border-black/5 px-5 py-6">
            <Link to="/" className="group flex items-center gap-3">
              <img src={IMG.logo} alt="Vistory" className="h-10 w-auto" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#5f3713]">Admin</p>
                <p className="text-[10px] text-gray-500">Bảng điều khiển</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map(({ id, label, desc, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-start gap-3 rounded-xl px-4 py-3.5 text-left transition ${
                    active
                      ? "bg-[#5c3a21] text-white shadow-md"
                      : "text-gray-700 hover:bg-white/60"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-white/20 text-white" : "bg-[#fff3e9] text-[#5f3713]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${active ? "text-white" : "text-gray-800"}`}>
                      {label}
                    </p>
                    <p className={`mt-0.5 text-[11px] ${active ? "text-white/70" : "text-gray-500"}`}>
                      {desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="">
            
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-black/5 bg-[#fbf0ce]/95 px-4 py-4 backdrop-blur-md sm:px-8">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none lg:hidden">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeTab === id
                      ? "bg-[#5c3a21] text-white"
                      : "border border-black/10 bg-white text-gray-600"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5f3713] text-white shadow-sm">
                  <ActiveIcon className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-wide text-[#623715]">
                    {navItems.find((n) => n.id === activeTab)?.label}
                  </h1>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="h-3 w-3 text-[#5f3713]" />
                    Quản trị hệ thống
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/80 px-4 py-2 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5f3713] text-sm font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-gray-800">{displayName}</p>
                    <p className="max-w-[160px] truncate text-[11px] text-gray-500">{email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 lg:hidden"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-8">
            {activeTab === "revenue" && <RevenueChart />}
            {activeTab === "users" && <UserTable />}
            {activeTab === "content" && <ContentEditor />}
          </main>
        </div>
      </div>
    </div>
  );
}
