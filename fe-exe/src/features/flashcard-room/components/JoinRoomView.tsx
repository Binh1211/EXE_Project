import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function JoinRoomView() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length === 6) {
      navigate(`/flashcard-rooms/${code.toUpperCase()}/play`);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-8 h-8 ml-1" />
        </div>
        <h1 className="text-2xl font-bold text-[#5f3713] mb-2">Tham gia bài kiểm tra</h1>
        <p className="text-sm text-gray-500 mb-8">
          Nhập mã phòng (Join Code) gồm 6 ký tự để bắt đầu làm bài.
        </p>

        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="w-full px-6 py-4 text-center text-3xl font-mono font-bold tracking-[0.3em] rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#d87c32] focus:ring-4 focus:ring-[#d87c32]/20 transition uppercase"
            placeholder="XXXXXX"
            required
          />
          <button
            type="submit"
            disabled={code.trim().length < 6}
            className="w-full py-4 bg-[#d87c32] text-white rounded-xl font-bold text-lg hover:bg-[#b86725] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#d87c32]/30"
          >
            Vào phòng
          </button>
        </form>
      </div>
    </div>
  );
}
