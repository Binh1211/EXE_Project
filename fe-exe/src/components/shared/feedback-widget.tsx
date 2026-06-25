import { useState, useEffect, useRef } from "react";
import { X, MessageSquareHeart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { API_BASE_URL } from "@/lib/api-client";

export function FeedbackWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthUser();
  const userId = user?.id || "guest";

  const SUBMIT_KEY = `vistory_feedback_submitted_${userId}`;
  const DISMISS_KEY = `vistory_feedback_dismissed_${userId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [checked, setChecked] = useState(false);

  // Lưu pathname trước đó để phát hiện khi user rời khỏi trang /feedback
  const prevPathRef = useRef<string | null>(null);

  // Khi user rời khỏi trang /feedback (ví dụ bấm Hủy bỏ) → hiện lại widget ở dạng minimized
  useEffect(() => {
    const prev = prevPathRef.current;
    if (prev === "/feedback" && location.pathname !== "/feedback") {
      // Vừa rời trang feedback → hiện lại widget (minimized) nếu chưa submit
      const localSubmitted = localStorage.getItem(SUBMIT_KEY);
      if (!localSubmitted) {
        setIsOpen(true);
        setIsMinimized(true);
      }
    }
    prevPathRef.current = location.pathname;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    setIsOpen(false);
    setIsMinimized(false);
    setChecked(false);

    // Bước 1: Kiểm tra cache local trước (nhanh)
    const localSubmitted = localStorage.getItem(SUBMIT_KEY);
    if (localSubmitted) {
      setChecked(true);
      return; // isOpen = false → không hiện gì
    }

    // Bước 2: Nếu là user đã đăng nhập → hỏi backend (nguồn sự thật xuyên máy)
    if (user?.id) {
      fetch(`${API_BASE_URL}/api/feedbacks/check?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.submitted) {
            localStorage.setItem(SUBMIT_KEY, "true");
            setChecked(true);
            return;
          }
          showWidget();
        })
        .catch(() => showWidget()); // fallback nếu lỗi mạng
    } else {
      // Guest → không hiện form feedback
      setChecked(true);
      return;
    }

    function showWidget() {
      setChecked(true);
      const hasDismissed = localStorage.getItem(DISMISS_KEY);
      if (hasDismissed) {
        setIsOpen(true);
        setIsMinimized(true);
        return;
      }
      setTimeout(() => setIsOpen(true), 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setIsMinimized(true);
  };

  if (location.pathname === "/feedback") return null;
  if (!checked || !isOpen) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-transform hover:scale-110 active:scale-95 group"
        aria-label="Góp ý"
      >
        <MessageSquareHeart size={24} className="transition-transform group-hover:rotate-12" />
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-red-900 shadow-sm animate-pulse">
          1
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-sm flex-col gap-3 rounded-2xl bg-white/90 p-5 shadow-2xl backdrop-blur-md transition-all duration-300 dark:bg-zinc-900/90 dark:text-white border border-gray-200 dark:border-zinc-800">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-3 pr-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <MessageSquareHeart size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white font-history">GÓP Ý CHO TỤI MÌNH</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Chia sẻ trải nghiệm của bạn để Vistory phục vụ tốt hơn nhé! Khảo sát chỉ mất 2-3 phút thôi.
          </p>
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <button
          onClick={handleDismiss}
          className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors"
        >
          Thoát
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            navigate("/feedback");
          }}
          className="rounded-full bg-red-600 px-5 py-1.5 text-sm font-bold text-white hover:bg-red-700 transition-all shadow-md shadow-red-600/20 active:scale-95"
        >
          Tham gia
        </button>
      </div>
    </div>
  );
}
