import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { flashcardRoomApi, type RoomParticipant } from "../api/flashcard-room-api";
import { Trophy, Clock, Medal } from "lucide-react";

export default function LeaderboardView() {
  const { code } = useParams();
  const [leaderboard, setLeaderboard] = useState<RoomParticipant[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await flashcardRoomApi.getLeaderboard(code!);
        setLeaderboard(res.leaderboard);
        setTitle(res.title);
        setStatus(res.status);
      } catch (err: any) {
        setError(err.message || "Không thể tải bảng xếp hạng.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLeaderboard();
    
    // Auto refresh every 5 seconds if room is active
    let interval: any;
    if (status !== "closed") {
      interval = setInterval(fetchLeaderboard, 5000);
    }
    
    return () => clearInterval(interval);
  }, [code, status]);

  if (isLoading) return <div className="text-center py-20">Đang tải bảng xếp hạng...</div>;

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}p ${s}s`;
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case 1: return "bg-gray-100 text-gray-500 border-gray-200";
      case 2: return "bg-orange-50 text-orange-600 border-orange-200";
      default: return "bg-white text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#5f3713] mb-2">Bảng Xếp Hạng</h1>
        <p className="text-lg text-gray-600 font-medium">{title}</p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-100 rounded-full text-sm font-mono tracking-widest text-[#d87c32] font-bold">
          MÃ PHÒNG: {code}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Chưa có người chơi nào nộp bài.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaderboard.map((player, index) => (
              <div
                key={player.userId}
                className={`flex items-center justify-between p-6 transition-colors hover:bg-gray-50 ${
                  index < 3 ? "bg-gradient-to-r from-transparent to-white" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg border-2 shadow-sm ${getRankColor(index)}`}>
                    {index === 0 ? <Trophy className="w-6 h-6" /> : index === 1 || index === 2 ? <Medal className="w-6 h-6" /> : index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{player.displayName}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatTime(player.timeTakenSec)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#5f3713]">
                    {player.score} <span className="text-sm font-medium text-gray-400">điểm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
        >
          Trở về Trang chủ
        </Link>
      </div>
    </div>
  );
}
