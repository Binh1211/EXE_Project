import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Medal } from "lucide-react";
import { createDragonRaceSocket } from "../socket/dragon-race-socket";
import type { DragonRaceLeaderboardItem } from "../types/dragon-race";

export default function DragonRaceResultPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { roomCode } = useParams();
  const location = useLocation();
  const initialLeaderboard = useMemo(
    () => (location.state as { leaderboard?: DragonRaceLeaderboardItem[] } | null)?.leaderboard ?? [],
    [location.state],
  );
  const [leaderboard, setLeaderboard] = useState<DragonRaceLeaderboardItem[]>(initialLeaderboard);
  const [socketError, setSocketError] = useState("");

  useEffect(() => {
    if (!roomCode) return;
    const socket = createDragonRaceSocket();

    socket.on("connect", () => {
      socket.emit("join-room", { roomCode });
      socket.emit("request-leaderboard", { roomCode, onlyFinished: true });
    });

    socket.on("leaderboard-update", ({ leaderboard: updatedLeaderboard }: { leaderboard: DragonRaceLeaderboardItem[] }) => {
      setLeaderboard(updatedLeaderboard);
    });

    socket.on("game-error", ({ message }: { message: string }) => {
      setSocketError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode]);

  return (
    <div className="flex-1  px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/game/list")}
          className={`mb-8 inline-flex items-center gap-2 text-sm font-bold ${isDark ? "text-white" : "text-[#5c3a21]"}`}
        >
          <ArrowLeft size={18} />
          Danh sách trò chơi
        </button>

        <div className="rounded-2xl border border-[#5c3a21]/10 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#5c3a21]">Bảng xếp hạng</h1>
              <p className="mt-2 text-sm text-gray-500">Phòng {roomCode}</p>
              {socketError && (
                <p className="mt-2 text-sm font-medium text-red-600">{socketError}</p>
              )}
            </div>
            <Medal className="text-amber-500" size={42} />
          </div>

          {leaderboard.length === 0 ? (
            <p className="py-12 text-center text-gray-500">Chưa có dữ liệu kết quả.</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((item) => (
                <div
                  key={item.userId}
                  className="grid grid-cols-12 items-center gap-4 rounded-xl border border-gray-100 bg-[#fffaf7] px-5 py-4"
                >
                  <div className="col-span-2 text-2xl font-bold text-[#5c3a21]">
                    {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                  </div>
                  <div className="col-span-6">
                    <p className="font-bold text-[#5c3a21]">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.correctAnswers} câu đúng</p>
                  </div>
                  <div className="col-span-4 text-right text-xl font-bold text-[#5c3a21]">
                    {item.score} điểm
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
