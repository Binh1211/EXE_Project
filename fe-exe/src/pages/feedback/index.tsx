import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, getApiErrorMessage } from "@/lib/api-client";
import { useTheme } from "@/lib/ThemeContext";
import { IMG } from "@/lib/images";
import { Star } from "lucide-react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const RatingStars = ({ value, onChange, max = 5 }: { value: number; onChange: (v: number) => void; max?: number }) => {
  const [hoverValue, setHoverValue] = useState(0);
  return (
    <div className="flex gap-2" onMouseLeave={() => setHoverValue(0)}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const active = (hoverValue || value) >= starValue;
        return (
          <button
            type="button"
            key={i}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            className={`transition-all hover:scale-110 active:scale-95 ${
              active ? "text-yellow-400 drop-shadow-md" : "text-gray-300 dark:text-zinc-700"
            }`}
          >
            <Star 
              size={32} 
              fill={active ? "currentColor" : "transparent"} 
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuthUser();
  const userId = user?.id || "guest";
  const SUBMIT_KEY = `vistory_feedback_submitted_${userId}`;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    role: "",
    uiRating: 0,
    uiInteraction: "",
    techIssues: "",
    contentMindmap: "",
    contentLength: "",
    gamificationRating: 0,
    favoriteFeatures: [] as string[],
    nps: 0,
    improvements: [] as string[],
    generalFeedback: "",
  });

  const handleCheckboxChange = (field: keyof typeof formData, value: string, max?: number) => {
    const list = formData[field] as string[];
    if (list.includes(value)) {
      setFormData({ ...formData, [field]: list.filter((i) => i !== value) });
    } else {
      if (max && list.length >= max) return;
      setFormData({ ...formData, [field]: [...list, value] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiRequest("/api/feedbacks", {
        method: "POST",
        body: JSON.stringify({ ...formData, userId: user?.id }), // optional: gui kem userId cho be neu muon
      });
      setSuccess(true);
      localStorage.setItem(SUBMIT_KEY, "true");
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div 
      className="min-h-screen bg-cover font-history p-4 md:p-8 flex items-center justify-center transition-all duration-500"
      style={{ backgroundImage: isDark ? `url(${IMG.bgDarkmode})` : `url(${IMG.paperTexture})` }}
    >
      <div className="w-full max-w-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
        <div className="bg-red-600 p-8 text-center text-white">
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">Khảo Sát Trải Nghiệm Vistory</h1>
          <p className="opacity-90 max-w-lg mx-auto">Chia sẻ cảm nhận của bạn để giúp chúng mình phát triển một nền tảng học lịch sử thú vị và cuốn hút hơn nhé!</p>
        </div>

        {success ? (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-6">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cảm ơn bạn rất nhiều!</h2>
            <p className="text-gray-600 dark:text-gray-400">Những đóng góp của bạn là vô giá. Hệ thống đang tự động quay lại trang trước...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
            {/* PHẦN 1 */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">1</span>
                Thông tin chung
              </h3>
              <p className="text-sm text-gray-500 mb-4">Giúp nhóm biết ai đang nhận xét để phân tích insight chính xác hơn.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {["Học sinh THPT (Lớp 10 - 12)", "Sinh viên Đại học", "Giáo viên / Giảng viên", "Khác (Phụ huynh, người yêu thích Lịch sử...)"].map((opt) => (
                  <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === opt ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 hover:border-gray-200 dark:border-zinc-800 dark:hover:border-zinc-700'}`}>
                    <input type="radio" name="role" value={opt} checked={formData.role === opt} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-5 h-5 text-red-600 accent-red-600" required />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* PHẦN 2 */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">2</span>
                Trải nghiệm Giao diện & Tương tác (UI/UX)
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Ấn tượng đầu tiên của bạn về giao diện (màu sắc, hình ảnh, cách sắp xếp) của Vistory như thế nào?</p>
                  <p className="text-xs text-gray-500 mb-3">(Từ 1: Rất rối mắt/Nhàm chán đến 5: Cực kỳ hiện đại/Cuốn hút)</p>
                  <RatingStars value={formData.uiRating} onChange={(v) => setFormData({ ...formData, uiRating: v })} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Việc thao tác trên Dòng thời gian tương tác (Interactive Timeline) và Bản đồ lịch sử có dễ dàng với bạn không?</p>
                  <div className="space-y-2">
                    {["Rất dễ, chạm/lướt mượt mà.", "Bình thường, cần một chút thời gian để làm quen.", "Khó dùng, không biết phải bấm vào đâu."].map((opt) => (
                      <label key={opt} className="flex items-center gap-3">
                        <input type="radio" name="uiInteraction" value={opt} onChange={(e) => setFormData({ ...formData, uiInteraction: e.target.value })} className="w-4 h-4 accent-red-600" required />
                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Bạn có gặp lỗi kỹ thuật nào trong quá trình trải nghiệm không?</p>
                  <div className="space-y-2">
                    {["Không, mọi thứ chạy rất mượt.", "Có, thỉnh thoảng bị chậm hoặc đơ.", "Có lỗi nghiêm trọng (Vui lòng mô tả chi tiết ở câu hỏi cuối form)."].map((opt) => (
                      <label key={opt} className="flex items-center gap-3">
                        <input type="radio" name="techIssues" value={opt} onChange={(e) => setFormData({ ...formData, techIssues: e.target.value })} className="w-4 h-4 accent-red-600" required />
                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN 3 */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">3</span>
                Đánh giá Nội dung bài học số hóa
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Bạn thấy cách giải thích lịch sử theo mô hình Mind-map như thế nào?</p>
                  <div className="space-y-2">
                    {["Giúp mình hiểu bản chất câu chuyện, không cần học thuộc lòng.", "Dễ hiểu hơn sách giáo khoa, nhưng vẫn cần nhiều chữ hơn.", "Chưa thực sự thấy khác biệt so với cách đọc truyền thống."].map((opt) => (
                      <label key={opt} className="flex items-center gap-3">
                        <input type="radio" name="contentMindmap" value={opt} onChange={(e) => setFormData({ ...formData, contentMindmap: e.target.value })} className="w-4 h-4 accent-red-600" required />
                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Độ dài và lượng thông tin trong mỗi chặng bài học hiện tại đã hợp lý chưa?</p>
                  <div className="space-y-2">
                    {["Vừa vặn, tinh gọn đúng gu Gen Z.", "Hơi ngắn, mình muốn đọc sâu hơn về chi tiết lịch sử.", "Hơi dài, nhìn nhiều chữ vẫn thấy hơi ngợp."].map((opt) => (
                      <label key={opt} className="flex items-center gap-3">
                        <input type="radio" name="contentLength" value={opt} onChange={(e) => setFormData({ ...formData, contentLength: e.target.value })} className="w-4 h-4 accent-red-600" required />
                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN 4 */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">4</span>
                Tính năng Gamification
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Hệ thống Game ôn tập / "Nhiệm vụ lịch sử" có đủ sức giữ chân bạn không?</p>
                  <p className="text-xs text-gray-500 mb-3">(Từ 1: Nhạt nhẽo, làm cho có đến 5: Cực kỳ bánh cuốn, muốn chơi lại)</p>
                  <RatingStars value={formData.gamificationRating} onChange={(v) => setFormData({ ...formData, gamificationRating: v })} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Tính năng nào trên website làm bạn cảm thấy thích thú và ấn tượng nhất? (Chọn tối đa 2)</p>
                  <div className="space-y-2">
                    {["Dòng thời gian chuyển động (Interactive Timeline)", "Game ôn tập tương tác (Gamified Quiz)"].map((opt) => (
                      <label key={opt} className="flex items-center gap-3">
                        <input type="checkbox" checked={formData.favoriteFeatures.includes(opt)} onChange={() => handleCheckboxChange("favoriteFeatures", opt, 2)} className="w-4 h-4 accent-red-600 rounded" />
                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN 5 */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">5</span>
                Đánh giá Tổng kết & Đóng góp ý kiến
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Mức độ sẵn sàng giới thiệu Vistory cho bạn bè hoặc thầy cô cùng sử dụng của bạn là bao nhiêu?</p>
                  <p className="text-xs text-gray-500 mb-3">(NPS: Từ 1: Không bao giờ đến 5: Chắc chắn sẽ giới thiệu nhiệt tình)</p>
                  <RatingStars value={formData.nps} onChange={(v) => setFormData({ ...formData, nps: v })} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Nếu được thay đổi hoặc thêm tính năng để Vistory hoàn hảo hơn, bạn muốn gì nhất?</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["Thêm nhạc nền", "Thêm các trò chơi ôn tập", "Mở rộng thêm bài học"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => handleCheckboxChange("improvements", opt)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.improvements.includes(opt)
                            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-700"
                        } border`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Chia sẻ thêm góp ý, lời nhắn nhủ hoặc báo lỗi kỹ thuật (nếu có):</p>
                  <textarea
                    value={formData.generalFeedback}
                    onChange={(e) => setFormData({ ...formData, generalFeedback: e.target.value })}
                    rows={4}
                    placeholder="Nhập ý kiến của bạn tại đây..."
                    className="w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:focus:border-red-500 transition-colors"
                  ></textarea>
                </div>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading || formData.uiRating === 0 || formData.gamificationRating === 0 || formData.nps === 0}
                className="px-8 py-3 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                {loading ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
