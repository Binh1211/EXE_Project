import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { ArrowLeft, Copy, Crown, Loader2, Play, ShieldCheck } from "lucide-react";
import { getStoredUser } from "@/features/auth/lib/auth-session";
import { createDragonRaceSocket } from "../socket/dragon-race-socket";
import type { DragonRaceRoom } from "../types/dragon-race";

export default function DragonRaceLobbyPage() {
  const { roomCode = "" } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const currentUser = getStoredUser();
  const socketRef = useRef<Socket | null>(null);
  const [room, setRoom] = useState<DragonRaceRoom | null>(null);
  const [countdown, setCountdown] = useState("");
  const [error, setError] = useState("");

  const isHost = room?.hostId === currentUser?.id;
  const currentPlayer = useMemo(
    () => room?.players.find((player) => player.userId === currentUser?.id),
    [currentUser?.id, room?.players],
  );

  useEffect(() => {
    const socket = createDragonRaceSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", { roomCode });
    });
    socket.on("room-updated", (updatedRoom: DragonRaceRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom.status === "playing") {
        navigate(`/game/dua-rong/race/${updatedRoom.roomCode}`);
      }
    });
    socket.on("countdown", ({ value }: { value: string }) => {
      setCountdown(value);
      navigate(`/game/dua-rong/race/${roomCode}`);
    });
    socket.on("game-error", ({ message }: { message: string }) => setError(message));

    return () => {
      socket.disconnect();
    };
  }, [navigate, roomCode]);

  const ready = () => {
    socketRef.current?.emit("ready-room", { roomCode });
  };

  const start = () => {
    socketRef.current?.emit("start-game", { roomCode });
  };

  return (
    <div className="flex-1   px-8 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/game/dua-rong/create")}
          className={`mb-8 inline-flex items-center gap-2 text-sm font-bold ${isDark ? "text-white" : "text-[#5c3a21]"}`}
        >
          <ArrowLeft size={18} />
          Tạo phòng khác
        </button>

        <div className="rounded-2xl border border-[#5c3a21]/10 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Mã phòng</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-mono text-5xl font-bold tracking-[0.2em] text-[#5c3a21]">
                  {roomCode}
                </span>
                <button
                  type="button"
                  onClick={() => void navigator.clipboard?.writeText(roomCode)}
                  className="rounded-xl border border-gray-200 p-3 text-[#5c3a21] hover:bg-[#5c3a21]/5"
                  title="Sao chép mã phòng"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-[#5c3a21]/5 px-5 py-3 text-sm font-bold text-[#5c3a21]">
              {room?.status === "waiting" ? "Đang chờ người chơi" : room?.status ?? "Đang kết nối"}
            </div>
          </div>

          {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {countdown && (
            <div className="mt-8 rounded-2xl bg-[#5c3a21] py-8 text-center text-6xl font-bold text-white">
              {countdown}
            </div>
          )}

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {!room ? (
              <div className="col-span-full flex items-center justify-center gap-3 py-16 text-[#5c3a21]">
                <Loader2 className="animate-spin" />
                Đang vào phòng...
              </div>
            ) : (
              room.players.map((player) => (
                <div
                  key={player.userId}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#fffaf7] px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c3a21] font-bold text-white">
                      {player.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <p className="font-bold text-[#5c3a21]">{player.username}</p>
                      {player.userId === room.hostId && (
                        <p className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Crown size={12} />
                          Chủ phòng
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${player.isReady
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {player.isReady ? "Ready" : "Chờ"}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!room || currentPlayer?.isReady}
              onClick={ready}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#5c3a21]/20 bg-white px-6 py-3 text-sm font-bold text-[#5c3a21] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShieldCheck size={18} />
              Ready
            </button>
            {isHost && (
              <button
                type="button"
                onClick={start}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5c3a21] px-6 py-3 text-sm font-bold text-white"
              >
                <Play size={18} fill="currentColor" />
                Start
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
