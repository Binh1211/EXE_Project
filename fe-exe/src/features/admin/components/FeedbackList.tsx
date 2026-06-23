import { useState, useEffect, useCallback } from "react";
import { Star, RefreshCw, ChevronLeft, ChevronRight, User } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-client";

interface FeedbackItem {
  _id: string;
  userId?: string;
  role: string;
  uiRating: number;
  uiInteraction: string;
  techIssues: string;
  contentMindmap: string;
  contentLength: string;
  gamificationRating: number;
  favoriteFeatures: string[];
  nps: number;
  improvements: string[];
  generalFeedback?: string;
  createdAt: string;
}

function StarDisplay({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < value ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-gray-700">{value}/{max}</span>
    </div>
  );
}

function Badge({ text, color = "gray" }: { text: string; color?: "red" | "green" | "blue" | "yellow" | "gray" }) {
  const colors = {
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors[color]}`}>
      {text}
    </span>
  );
}

export function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const LIMIT = 10;

  const fetchFeedbacks = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedbacks?page=${p}&limit=${LIMIT}`);
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks(page);
  }, [page, fetchFeedbacks]);

  const avgStat = (key: keyof FeedbackItem) => {
    if (feedbacks.length === 0) return "—";
    const vals = feedbacks.map((f) => f[key] as number).filter((v) => typeof v === "number");
    if (!vals.length) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const roleColor = (role: string) => {
    if (role.includes("THPT")) return "blue";
    if (role.includes("Đại học")) return "green";
    if (role.includes("Giáo viên")) return "red";
    return "gray";
  };

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Tổng phản hồi", value: total, sub: "khảo sát" },
          { label: "Điểm UI/UX TB", value: feedbacks.length ? avgStat("uiRating") : "—", sub: "/ 5 sao" },
          { label: "Gamification TB", value: feedbacks.length ? avgStat("gamificationRating") : "—", sub: "/ 5 sao" },
          { label: "NPS Score TB", value: feedbacks.length ? avgStat("nps") : "—", sub: "/ 5 sao" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-[#5c3a21]">{value}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black/5 bg-white/90 shadow-sm backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="font-bold text-[#5c3a21]">Danh sách phản hồi</h2>
          <button
            onClick={() => fetchFeedbacks(page)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5c3a21] border-t-transparent" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">Chưa có phản hồi nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Người dùng</th>
                  <th className="px-4 py-3">UI/UX</th>
                  <th className="px-4 py-3">Game</th>
                  <th className="px-4 py-3">NPS</th>
                  <th className="px-4 py-3">Vấn đề KT</th>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {feedbacks.map((f) => (
                  <tr key={f._id} className="transition hover:bg-amber-50/40">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge text={f.role.split("(")[0].trim()} color={roleColor(f.role)} />
                        {f.userId && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <User size={10} />
                            {f.userId.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={f.uiRating} />
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={f.gamificationRating} />
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={f.nps} />
                    </td>
                    <td className="px-4 py-4 max-w-[160px]">
                      <span className={`text-xs ${f.techIssues.includes("lỗi") || f.techIssues.includes("chậm") ? "text-red-600 font-medium" : "text-gray-500"}`}>
                        {f.techIssues.length > 40 ? f.techIssues.slice(0, 40) + "…" : f.techIssues}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(f.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelected(f)}
                        className="rounded-lg bg-[#5c3a21] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#7a4e2d]"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-black/5 px-6 py-4">
            <p className="text-xs text-gray-500">
              Trang {page} / {totalPages} · Tổng {total} phản hồi
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={14} /> Trước
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Sau <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition"
            >
              ✕
            </button>

            <div className="mb-6">
              <Badge text={selected.role.split("(")[0].trim()} color={roleColor(selected.role)} />
              <p className="mt-1 text-xs text-gray-400">
                {new Date(selected.createdAt).toLocaleString("vi-VN")}
                {selected.userId && ` · User: ${selected.userId}`}
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: "🎨 Điểm UI/UX", value: <StarDisplay value={selected.uiRating} /> },
                { label: "⚙️ Thao tác Timeline", value: selected.uiInteraction },
                { label: "🐛 Lỗi kỹ thuật", value: selected.techIssues },
                { label: "🗺️ Mind-map", value: selected.contentMindmap },
                { label: "📏 Độ dài bài học", value: selected.contentLength },
                { label: "🎮 Điểm Gamification", value: <StarDisplay value={selected.gamificationRating} /> },
                {
                  label: "⭐ Tính năng yêu thích",
                  value: selected.favoriteFeatures.length
                    ? selected.favoriteFeatures.join(", ")
                    : "Không chọn",
                },
                { label: "📣 NPS (Giới thiệu)", value: <StarDisplay value={selected.nps} /> },
                {
                  label: "💡 Đề xuất cải tiến",
                  value: selected.improvements.length ? selected.improvements.join(", ") : "Không có",
                },
                {
                  label: "✍️ Góp ý tự do",
                  value: selected.generalFeedback || <span className="text-gray-400 italic">Không có</span>,
                },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                  <div className="text-sm text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
