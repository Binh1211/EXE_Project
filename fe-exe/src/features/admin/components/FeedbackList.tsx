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
            className="flex items-center gap-1.5 rounded-full border-2 border-[#5c3a21] bg-white px-4 py-1.5 text-xs font-bold text-[#5c3a21] transition hover:bg-[#5c3a21] hover:text-white disabled:opacity-50 shadow-sm"
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
                        className="rounded-full border-2 border-[#5c3a21] bg-white px-3 py-1 text-xs font-bold text-[#5c3a21] transition hover:bg-[#5c3a21] hover:text-white shadow-sm"
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
                className="flex items-center gap-1 rounded-full border-2 border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-[#5c3a21] hover:text-[#5c3a21] disabled:opacity-40"
              >
                <ChevronLeft size={14} /> Trước
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 rounded-full border-2 border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-[#5c3a21] hover:text-[#5c3a21] disabled:opacity-40"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#5c3a21] to-[#8c5a35] px-8 py-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-6 top-6 rounded-full bg-black/20 p-2 text-white/80 hover:bg-black/40 hover:text-white transition backdrop-blur-md"
              >
                ✕
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Chi tiết phản hồi</h3>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
                      {selected.role.split("(")[0].trim()}
                    </span>
                    <span className="text-sm text-white/80 flex items-center gap-1">
                      🗓️ {new Date(selected.createdAt).toLocaleString("vi-VN")}
                    </span>
                    {selected.userId && (
                      <span className="text-sm text-white/80 flex items-center gap-1 border-l border-white/20 pl-3">
                        <User size={14} /> User: {selected.userId.slice(0,8)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto bg-gray-50/50 flex-1 space-y-8 custom-scrollbar">
              {/* Ratings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "🎨 Điểm UI/UX", value: <StarDisplay value={selected.uiRating} /> },
                  { label: "🎮 Gamification", value: <StarDisplay value={selected.gamificationRating} /> },
                  { label: "📣 NPS", value: <StarDisplay value={selected.nps} /> },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-md transition">
                    <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
                    <div className="text-lg">{value}</div>
                  </div>
                ))}
              </div>

              {/* Content Feedback */}
              <div className="rounded-2xl border border-black/5 bg-white overflow-hidden shadow-sm">
                <div className="bg-gray-50/80 px-5 py-3 border-b border-black/5">
                  <h4 className="font-semibold text-[#5c3a21] flex items-center gap-2">
                    <span>📝</span> Đánh giá trải nghiệm
                  </h4>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">⚙️ Thao tác Timeline</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl">{selected.uiInteraction}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">🗺️ Mind-map</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl">{selected.contentMindmap}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">📏 Độ dài bài học</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl">{selected.contentLength}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">⭐ Tính năng yêu thích</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selected.favoriteFeatures.length > 0 ? (
                        selected.favoriteFeatures.map(f => (
                          <span key={f} className="inline-block bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">Không chọn</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-black/5 bg-white shadow-sm flex flex-col">
                  <div className="bg-red-50/50 px-5 py-3 border-b border-red-100">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2">
                      <span>🐛</span> Lỗi kỹ thuật
                    </h4>
                  </div>
                  <div className="p-5 flex-1">
                    <p className="text-sm text-gray-800">{selected.techIssues}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white shadow-sm flex flex-col">
                  <div className="bg-blue-50/50 px-5 py-3 border-b border-blue-100">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                      <span>💡</span> Đề xuất cải tiến
                    </h4>
                  </div>
                  <div className="p-5 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.improvements.length > 0 ? (
                        selected.improvements.map(imp => (
                          <span key={imp} className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                            {imp}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">Không có</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* General Feedback */}
              <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
                <div className="bg-green-50/50 px-5 py-3 border-b border-green-100">
                  <h4 className="font-semibold text-green-700 flex items-center gap-2">
                    <span>✍️</span> Góp ý tự do
                  </h4>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-800 italic bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    "{selected.generalFeedback || <span className="text-gray-400">Không có góp ý thêm</span>}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
