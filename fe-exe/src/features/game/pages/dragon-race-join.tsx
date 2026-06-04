import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";

export default function DragonRaceJoinPage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const normalizedCode = roomCode.trim().toUpperCase();

  return (
    <div className="flex-1 bg-[#fff6f4] px-8 py-10">
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={() => navigate("/game/list")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#5c3a21]"
        >
          <ArrowLeft size={18} />
          Danh sách trò chơi
        </button>

        <div className="rounded-2xl border border-[#5c3a21]/10 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#5c3a21]">Vào phòng Đua Rồng</h1>
          <p className="mt-2 text-sm text-gray-500">Nhập mã phòng do bạn bè chia sẻ.</p>

          <input
            value={roomCode}
            onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
            maxLength={6}
            placeholder="ABCD12"
            className="mt-8 w-full rounded-xl border border-gray-200 px-5 py-4 text-center font-mono text-3xl font-bold tracking-[0.3em] text-[#5c3a21] outline-none focus:border-[#5c3a21]"
          />

          <button
            type="button"
            disabled={normalizedCode.length < 4}
            onClick={() => navigate(`/game/dua-rong/lobby/${normalizedCode}`)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5c3a21] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <LogIn size={18} />
            Vào phòng
          </button>
        </div>
      </div>
    </div>
  );
}
