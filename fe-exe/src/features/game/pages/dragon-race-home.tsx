import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/ThemeContext";
import { ArrowLeft, Plus, Users } from "lucide-react";

export default function DragonRaceHomePage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="flex-1  px-8 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/game/list")}
          className={`mb-8 inline-flex items-center gap-2 text-sm font-bold ${isDark ? "text-white" : "text-[#5c3a21]"}`}
        >
          <ArrowLeft size={18} />
          Danh sách trò chơi
        </button>

        <div className="rounded-3xl border border-[#5c3a21]/10 bg-white p-10 shadow-sm">
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-[#5c3a21]"}`}>Đua Rồng</h1>
            <p className={`mt-3 leading-relaxed text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Chọn một cách tham gia cuộc đua.
              Bạn có thể tạo phòng mới và mời bạn bè vào chơi, hoặc vào ngay phòng có sẵn bằng mã.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/game/dua-rong/create")}
              className="rounded-3xl border border-[#5c3a21]/10 bg-[#ECFDF5] p-8 text-left shadow-sm transition hover:border-[#5c3a21]/30 hover:shadow-md"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-[#D1FAE5] text-[#065F46] mb-6">
                <Plus size={28} />
              </div>
              <h2 className="text-2xl font-bold text-[#065F46] mb-2">Tạo phòng</h2>
              <p className="text-gray-600">
                Tạo phòng mới và chia sẻ mã cho bạn bè. Cuộc đua sẽ bắt đầu khi đủ người chơi.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/game/dua-rong/join")}
              className="rounded-3xl border border-[#5c3a21]/10 bg-[#FEF3C7] p-8 text-left shadow-sm transition hover:border-[#5c3a21]/30 hover:shadow-md"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-[#FDE68A] text-[#92400E] mb-6">
                <Users size={28} />
              </div>
              <h2 className="text-2xl font-bold text-[#92400E] mb-2">Vào phòng</h2>
              <p className="text-gray-600">
                Nhập mã phòng có sẵn để vào nhanh. Không cần tạo phòng mới nếu bạn đã có mã.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
