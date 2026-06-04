import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { createDragonRaceSocket } from "../socket/dragon-race-socket";
import type {
  DragonRaceLeaderboardItem,
  DragonRacePlayer,
  DragonRaceQuestion,
  DragonRaceRoom,
} from "../types/dragon-race";

export default function DragonRaceRacePage() {
  const { roomCode = "" } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const questionStartedAtRef = useRef(0);
  const [room, setRoom] = useState<DragonRaceRoom | null>(null);
  const [players, setPlayers] = useState<DragonRacePlayer[]>([]);
  const [question, setQuestion] = useState<DragonRaceQuestion | null>(null);
  const [countdown, setCountdown] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<"correct" | "wrong" | null>(null);
  const [error, setError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [remaining, setRemaining] = useState(15);

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players],
  );

  useEffect(() => {
    const socket = createDragonRaceSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", { roomCode });
    });
    socket.on("room-updated", (updatedRoom: DragonRaceRoom) => {
      setRoom(updatedRoom);
      setPlayers(updatedRoom.players);
    });
    socket.on("countdown", ({ value }: { value: string }) => {
      setCountdown(value);
    });
    socket.on("next-question", ({ question: nextQuestion }: { question: DragonRaceQuestion }) => {
      questionStartedAtRef.current = Date.now();
      setQuestion(nextQuestion);
      setRemaining(nextQuestion.timeLimit);
      setSelectedOptionId("");
      setCorrectOptionId(null);
      setAnswerResult(null);
      setError("");
      setFeedbackMessage("");
      setCountdown("");
    });
    socket.on("race-update", ({ players: updatedPlayers }: { players: DragonRacePlayer[] }) => {
      setPlayers(updatedPlayers);
    });
    socket.on(
      "answer-result",
      ({
        isCorrect,
        correctOptionId: serverCorrectOptionId,
        scoreGained,
        speedBonus,
      }: {
        isCorrect: boolean;
        correctOptionId?: string;
        scoreGained?: number;
        speedBonus?: number;
      }) => {
        setAnswerResult(isCorrect ? "correct" : "wrong");
        setCorrectOptionId(serverCorrectOptionId ?? null);
        setError("");
        const gained = scoreGained ?? 0;
        const bonus = speedBonus ?? 0;
        setFeedbackMessage(
          isCorrect
            ? bonus > 0
              ? `Đúng! +${gained} điểm (bonus +${bonus} điểm vì trả lời dưới 3s).`
              : `Đúng! +${gained} điểm.`
            : "Sai rồi, tiếp tục cố gắng!",
        );
      },
    );
    socket.on(
      "game-finished",
      ({ leaderboard }: { leaderboard: DragonRaceLeaderboardItem[] }) => {
        navigate(`/game/dua-rong/result/${roomCode}`, { state: { leaderboard } });
      },
    );
    socket.on(
      "player-finished",
      ({ leaderboard }: { leaderboard: DragonRaceLeaderboardItem[] }) => {
        navigate(`/game/dua-rong/result/${roomCode}`, { state: { leaderboard } });
      },
    );
    socket.on("game-error", ({ message }: { message: string }) => setError(message));

    return () => {
      socket.disconnect();
    };
  }, [navigate, roomCode]);

  useEffect(() => {
    if (!question || selectedOptionId) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartedAtRef.current) / 1000);
      setRemaining(Math.max(0, question.timeLimit - elapsed));
    }, 250);

    return () => clearInterval(interval);
  }, [question, selectedOptionId]);

  useEffect(() => {
    if (!question || selectedOptionId || remaining > 0) return;
    setSelectedOptionId("timeout");
    socketRef.current?.emit("submit-answer", {
      roomCode,
      questionId: question.questionId,
      timeTaken: question.timeLimit * 1000,
    });
  }, [question, remaining, selectedOptionId, roomCode]);

  const submitAnswer = (optionId: string) => {
    if (!question || selectedOptionId) return;

    setSelectedOptionId(optionId);
    socketRef.current?.emit("submit-answer", {
      roomCode,
      questionId: question.questionId,
      optionId,
      timeTaken: Date.now() - questionStartedAtRef.current,
    });
  };

  return (
    <div className="flex-1 bg-[#fff6f4] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`/game/dua-rong/lobby/${roomCode}`)}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#5c3a21]"
          >
            <ArrowLeft size={18} />
            Lobby
          </button>
          <div className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#5c3a21] shadow-sm">
            Phòng {roomCode} {room?.status ? `· ${room.status}` : ""}
          </div>
        </div>

        {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {feedbackMessage && !error && (
          <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {feedbackMessage}
          </p>
        )}

        {countdown && (
          <div className="mb-6 rounded-2xl bg-[#5c3a21] py-10 text-center text-7xl font-bold text-white">
            {countdown}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-2xl border border-[#5c3a21]/10 bg-white p-6 shadow-sm">
            {!question ? (
              <div className="flex min-h-[360px] items-center justify-center gap-3 text-[#5c3a21]">
                <Loader2 className="animate-spin" />
                Đang chờ câu hỏi...
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                    Câu {question.index + 1}/{question.total}
                  </p>
                  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                    remaining <= 5 ? "bg-red-50 text-red-700" : "bg-[#5c3a21]/5 text-[#5c3a21]"
                  }`}>
                    <Clock size={16} />
                    {remaining}s
                  </div>
                </div>

                <h1 className="mb-6 text-2xl font-bold leading-relaxed text-[#5c3a21]">
                  {question.text}
                </h1>

                <div className="grid gap-3">
                  {question.options.map((option, index) => (
                    <button
                      key={option.id}
                      type="button"
                      disabled={Boolean(selectedOptionId)}
                      onClick={() => submitAnswer(option.id)}
                      className={`flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition ${
                        selectedOptionId === option.id
                          ? answerResult === "correct"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : answerResult === "wrong"
                              ? "border-red-500 bg-red-50 text-red-800"
                              : "border-[#5c3a21] bg-[#5c3a21]/5"
                          : answerResult === "wrong" && option.id === correctOptionId
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-gray-200 hover:border-[#5c3a21]/40"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5c3a21] text-sm font-bold text-white">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{option.text}</span>
                    </button>
                  ))}
                </div>

                {selectedOptionId && (
                  <p className="mt-5 text-sm font-bold text-gray-500">
                    {answerResult === "correct"
                      ? "Đáp án đúng! Chuẩn bị cho câu hỏi tiếp theo ngay sau đây."
                      : answerResult === "wrong"
                        ? `Sai rồi. Đáp án đúng là: ${question?.options.find((opt) => opt.id === correctOptionId)?.text ?? "..."}`
                        : "Đã gửi câu trả lời. Đang chờ kết quả..."}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="rounded-2xl border border-[#5c3a21]/10 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#5c3a21]">Đường đua</h2>
            <div className="space-y-6">
              {sortedPlayers.map((player) => (
                <div key={player.userId}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold text-[#5c3a21]">{player.username}</span>
                    <span className="font-bold text-gray-500">{player.score} điểm</span>
                  </div>
                  <div className="relative h-12 overflow-hidden rounded-xl bg-[#f7eadf]">
                    <div className="absolute bottom-0 left-0 right-0 top-1/2 border-t border-dashed border-[#5c3a21]/30" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-500 ease-linear"
                      style={{
                        left: `${Math.min(player.position ?? 0, 94)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      🐉
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl">🏰</div>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {player.correctAnswers} câu đúng
                  </p>
                </div>
              ))}
              {sortedPlayers.length === 0 && (
                <p className="py-10 text-center text-gray-500">Đang đồng bộ người chơi...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
