import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Palette đồng bộ với trang user (Vistory) */
export const adminInput =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#5f3713] focus:ring-2 focus:ring-[#5f3713]/15";

export const adminSelect = adminInput;

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-black/5 bg-white/80 shadow-sm backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminCardHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/5 bg-[#fff3e9]/50 px-6 py-5">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5f3713] text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold tracking-wide text-[#623715]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function AdminBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "danger" | "muted";
}) {
  const styles = {
    default: "bg-[#fff3e9] text-[#5f3713] border-[#e8d5c4]",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    muted: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function AdminLoading({ label = "Đang tải..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#e8d5c4] border-t-[#5f3713]" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export function AdminEmpty({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3e9] text-2xl text-[#5f3713]/40">
        ∅
      </div>
      <p className="font-medium text-gray-600">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-400">{description}</p>}
    </div>
  );
}

export function AdminBtnPrimary({
  children,
  type = "button",
  onClick,
  className = "",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-xl bg-[#5f3713] py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#4a2e1a] active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

export function AdminGhostBtn({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-[#5f3713]/30 hover:text-[#5f3713]"
    >
      {children}
    </button>
  );
}

export function AdminErrorBox({ message }: { message: string }) {
  return (
    <div className="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

export function AdminColumnPanel({
  title,
  count,
  onAdd,
  showAdd,
  emptyHint,
  children,
}: {
  title: string;
  count?: number;
  onAdd?: () => void;
  showAdd?: boolean;
  emptyHint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[min(640px,70vh)] flex-col rounded-xl border border-black/5 bg-[#fdf8e7]/80">
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3 bg-white/50">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f3713]">
            {title}
          </h3>
          {count !== undefined && (
            <p className="mt-0.5 text-[10px] text-gray-400">{count} mục</p>
          )}
        </div>
        {showAdd && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5f3713] text-white shadow-sm hover:bg-[#4a2e1a] transition"
          >
            <span className="text-lg leading-none">+</span>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {emptyHint ? (
          <p className="py-12 px-2 text-center text-sm italic text-gray-400">{emptyHint}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function AdminListItem({
  active,
  onClick,
  title,
  subtitle,
  onDelete,
}: {
  active?: boolean;
  onClick?: () => void;
  title: string;
  subtitle?: string;
  onDelete?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group mb-2 flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-3 transition ${
        active
          ? "border-[#5c3a21] bg-[#5c3a21] text-white shadow-sm"
          : "border-black/5 bg-white hover:border-[#5f3713]/30 hover:shadow-sm"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${active ? "text-white" : "text-gray-800"}`}>
          {title}
        </p>
        {subtitle && (
          <p className={`mt-0.5 truncate text-xs ${active ? "text-white/70" : "text-gray-500"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={`shrink-0 rounded-lg p-1.5 opacity-0 transition group-hover:opacity-100 ${
            active
              ? "text-white/80 hover:bg-white/20"
              : "text-gray-400 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          ×
        </button>
      )}
    </div>
  );
}
