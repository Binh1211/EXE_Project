import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { ArrowLeft, Loader2 } from "lucide-react";
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

  const maxTime = question?.timeLimit ?? 15;
  const fullCircle = 188.5;
  const timerDashOffset = question ? fullCircle - (remaining / maxTime) * fullCircle : fullCircle;

  type LaneTemplate = {
    label: string;
    img: string;
    border: string;
    defaultLeft: string;
    extraClass: string;
  };

  type LaneData = LaneTemplate & {
    left: string;
    player?: DragonRacePlayer;
  };

  const trackHeightClass = sortedPlayers.length <= 2
    ? "h-[30vh] min-h-[240px]"
    : sortedPlayers.length === 3
      ? "h-[36vh] min-h-[300px]"
      : "h-[45vh] min-h-[380px]";

  const contentSectionClass = sortedPlayers.length <= 2
    ? "grid gap-4 px-4 pt-3 pb-6 lg:grid-cols-12 lg:px-8 lg:pt-4 lg:pb-10"
    : "grid gap-4 px-4 py-6 lg:grid-cols-12 lg:px-8 lg:py-10";

  const laneTemplates: LaneTemplate[] = [
    {
      label: "YOU",
      img: "/dau-rong.png",
      border: "border-[#ffb599]",
      defaultLeft: "65%",
      extraClass: "brightness-105 contrast-125 saturate-110 drop-shadow-xl",
    },
    {
      label: "Bolt",
      img: "/dau-rong.png",
      border: "border-[#bc70ff]",
      defaultLeft: "42%",
      extraClass: "brightness-105 contrast-125 saturate-110 drop-shadow-xl",
    },
    {
      label: "Frost",
      img: "/dau-rong.png",
      border: "border-[#ffb4a8]",
      defaultLeft: "58%",
      extraClass: "brightness-105 contrast-125 saturate-110 drop-shadow-xl",
    },
    {
      label: "Terra",
      img: "/dau-rong.png",
      border: "border-[#9ca3af]",
      defaultLeft: "30%",
      extraClass: "brightness-105 contrast-125 saturate-110 drop-shadow-xl",
    },
  ];

  const topLanes: LaneData[] = sortedPlayers.length > 0
    ? sortedPlayers.map((player, index) => {
      const template = laneTemplates[index % laneTemplates.length];
      const left = player.position !== undefined ? `${Math.min(player.position, 94)}%` : template.defaultLeft;
      return { ...template, left, player };
    })
    : laneTemplates.map((template) => ({
      ...template,
      left: template.defaultLeft,
    }));

  return (
    <div className="min-h-screen bg-[#171119] text-[#ecdfeb] overflow-x-hidden">
      <main className="relative mx-auto w-full max-w-[1920px]">
        <div className="flex items-center justify-between px-5 py-5 lg:px-10">
          <button
            type="button"
            onClick={() => navigate(`/game/dua-rong/lobby/${roomCode}`)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#171119]/80 px-4 py-2 text-sm font-bold text-[#ffb599] shadow-lg shadow-black/20"
          >
            <ArrowLeft size={18} />
            Lobby
          </button>
          <div className="rounded-full border border-white/10 bg-[#171119]/80 px-4 py-2 text-sm font-bold text-[#e4bfb1] shadow-lg shadow-black/20">
            Phòng {roomCode} · {room?.status ?? "Waiting"}
          </div>
        </div>

        <section className={`relative overflow-hidden flex flex-col ${trackHeightClass}`}>
          <div className="absolute inset-0 z-0">
            <img
              alt="Volcanic Background"
              className="w-full h-full object-cover opacity-30"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHapZwRe6z-lKLBL428NoF3BQKUA1dvhFsvK5FVP_BD0pRcKieJ4FupQZZHN-pGNPQkUbNxRQbj2BBrn1IQNFD8rU-UhxtkPJYMuEC-9-x-x7h-PAB1hHtXuaqKL8-ZduIw48mmU0wvN3C4bMvzBKbuA-abwjTEprx4hGXz4giq2l6trOcKN8GqEqjCpA8oQj7oU4R6exKoyk1Uq9Dap_hGNFwVIQI5qbRXxUXKAY3O9T26eNYgPga0jtcWgRHupznWOKAuf0V8jzX"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#171119] via-transparent to-[#171119]/90" />
          </div>

          <div className="relative z-10 flex flex-grow gap-3 px-4 py-3 lg:px-7 lg:py-5">
            <div className="flex-grow flex flex-col gap-2 relative overflow-y-auto pb-2 pt-4">
              {topLanes.map((lane) => (
                <div
                  key={lane.player?.userId ?? lane.label}
                  className={`min-h-[44px] rounded-xl border-l-4 ${lane.border} relative overflow-visible bg-[#1c1322]/70`}
                >
                  <div
                    className="absolute inset-0"
                    style={{ backgroundImage: "linear-gradient(90deg, rgba(23,17,25,0) 0%, rgba(255,95,5,0.05) 100%)" }}
                  />
                  {/* The stretching tail body */}
                  <div className="absolute top-1/2 left-0 transition-all duration-1000 ease-out z-20"
                    style={{ width: `max(0px, calc(${lane.left} - 45px))`, transform: "translateY(-50%)" }}>

                    {/* Wavy snake body divided into 20 segments */}
                    <div className="w-full h-[64px] relative flex">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="h-full flex-1 relative overflow-hidden"
                          style={{
                            animation: `tail-segment-wave 1.5s ease-in-out infinite`,
                            animationDelay: `${-(20 - i) * 0.1}s`
                          }}>
                          <div className="absolute top-1/2 h-[48px]"
                            style={{
                              width: `2000%`,
                              left: `-${i * 100}%`,
                              transform: "translateY(-50%)",
                              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='48'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23b91c1c'/%3E%3Cstop offset='100%25' stop-color='%23ea580c'/%3E%3C/linearGradient%3E%3ClinearGradient id='sg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fb923c'/%3E%3Cstop offset='100%25' stop-color='%23dc2626'/%3E%3C/linearGradient%3E%3CradialGradient id='bl' cx='50%25' cy='0%25' r='100%25'%3E%3Cstop offset='0%25' stop-color='%23fef08a'/%3E%3Cstop offset='100%25' stop-color='%23ca8a04'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect x='0' y='12' width='30' height='24' fill='url(%23bg)'/%3E%3Cpath d='M0,12 C10,0 20,16 30,2 L30,12 Z' fill='%23991b1b'/%3E%3Cpath d='M5,12 C12,4 20,12 30,6 L30,12 Z' fill='%23ea580c'/%3E%3Cpath d='M0,36 Q15,48 30,36 Z' fill='url(%23bl)' stroke='%23a16207' stroke-width='1'/%3E%3Cg fill='url(%23sg)' stroke='%237f1d1d' stroke-width='0.75'%3E%3Cpath d='M-15,14 A15,7 0 0,1 15,14 Z'/%3E%3Cpath d='M15,14 A15,7 0 0,1 45,14 Z'/%3E%3Cpath d='M0,19 A15,7 0 0,1 30,19 Z'/%3E%3Cpath d='M-15,24 A15,7 0 0,1 15,24 Z'/%3E%3Cpath d='M15,24 A15,7 0 0,1 45,24 Z'/%3E%3Cpath d='M0,29 A15,7 0 0,1 30,29 Z'/%3E%3Cpath d='M-15,34 A15,7 0 0,1 15,34 Z'/%3E%3Cpath d='M15,34 A15,7 0 0,1 45,34 Z'/%3E%3C/g%3E%3C/svg%3E\")",
                              backgroundSize: "30px 48px",
                              backgroundPosition: "left center"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dragon head */}
                  <div className="absolute top-1/2 flex items-center transition-all duration-1000 ease-out z-30"
                    style={{ left: lane.left, transform: "translate(-50%, -50%)" }}
                  >
                    <div className="w-24 h-24 relative animate-drift flex-shrink-0" style={{ marginLeft: '-12px' }}>
                      <img
                        alt={`${lane.label} Dragon`}
                        className={`w-full h-full object-contain drop-shadow-lg ${lane.extraClass}`}
                        src={lane.img}
                      />
                    </div>
                    <div className="ml-2 rounded-full bg-[#ffdbce] px-2 py-1 text-[10px] font-semibold text-[#531900] shadow-lg whitespace-nowrap">
                      {lane.player?.username ?? lane.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={contentSectionClass}>
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[18px] font-bold uppercase tracking-[0.2em] text-[#ffb599]">
                  <span className="text-[20px]">🏆</span>
                  Arena Ranks
                </h3>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#e4bfb1] font-bold">Live</span>
                </div>
              </div>

              <div className="space-y-3">
                {sortedPlayers.slice(0, 4).map((player, index) => (
                  <div key={player.userId} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm font-bold text-[#ecdfeb]">
                      <span>{index + 1}. {player.username}</span>
                      <span className="text-[#ffb599]">{player.score.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ffb599] to-[#ff5f05]"
                        style={{ width: `${Math.min(player.position ?? 10, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {sortedPlayers.length === 0 && (
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-[#e4bfb1]">
                    Đang đồng bộ người chơi...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 flex flex-col">
            <div className="glass-panel relative overflow-hidden rounded-3xl p-6 lg:p-10">
              <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-[#ffb599]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#dfb7ff]/10 blur-3xl" />

              <div className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1f1727]/80 backdrop-blur-lg">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64">
                  <circle className="text-white/10" cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" fill="transparent" />
                  <circle
                    className="text-[#ffb599]"
                    cx="32"
                    cy="32"
                    r="30"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="188.5"
                    strokeDashoffset={timerDashOffset}
                  />
                </svg>
                <span className="relative text-[20px] font-bold text-[#ffb599]">
                  {remaining}
                </span>
              </div>

              <div className="relative z-10 mx-auto flex max-w-3xl flex-col h-full">
                <div className="mb-2 text-center">
                  <h2 className="text-[26px] font-black leading-tight text-[#ecdfeb] sm:text-[32px]">
                    {question?.text ?? "Đang chờ câu hỏi..."}
                  </h2>

                  {countdown && (
                    <div className="mx-auto mb-6 inline-flex items-center rounded-full bg-[#93000a]/90 px-6 py-3 text-[24px] font-black text-[#ffdad6]">
                      {countdown}
                    </div>
                  )}

                  {error && (
                    <div className="mx-auto mb-4 rounded-3xl border border-[#93000a]/20 bg-[#93000a]/10 px-4 py-3 text-sm text-[#ffdad6]">
                      {error}
                    </div>
                  )}

                  {!error && feedbackMessage && (
                    <div className="mx-auto mb-4 rounded-3xl border border-[#f8f3a2]/30 bg-[#fdf7c4]/90 px-4 py-3 text-sm font-semibold text-[#2f361f] shadow-inner shadow-yellow-500/10">
                      {feedbackMessage}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {!question ? (
                    <div className="col-span-full rounded-3xl border border-white/10 bg-[#1f1727]/80 p-8 text-center text-[#e4bfb1]">
                      <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#ffb599]" />
                      Đang chờ câu hỏi...
                    </div>
                  ) : (
                    question.options.map((option, index) => {
                      const isSelected = selectedOptionId === option.id;
                      const isCorrect = option.id === correctOptionId;
                      const isWrongSelected = isSelected && answerResult === "wrong";
                      const showCorrectAnswer = selectedOptionId && answerResult === "wrong" && isCorrect;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={Boolean(selectedOptionId)}
                          onClick={() => submitAnswer(option.id)}
                          className={`btn-game group relative rounded-3xl border px-5 py-4 text-left transition-all duration-300 ${isSelected
                            ? answerResult === "correct"
                              ? "border-emerald-400 bg-emerald-900/30 text-[#ecdfeb] shadow-[0_0_30px_rgba(74,222,128,0.15)]"
                              : "border-[#93000a] bg-[#93000a]/20 text-[#ffdad6]"
                            : showCorrectAnswer
                              ? "border-emerald-400 bg-emerald-900/20 text-[#ecdfeb]"
                              : "border-[#aa897d]/30 bg-[#241d26]/80 hover:border-[#ff5f05] hover:bg-[#2b1f2b]"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffdbce]/20 text-[#ffb599] text-lg font-bold transition-all duration-300 ${isWrongSelected ? "bg-[#93000a]/25 text-[#ffdad6]" : "group-hover:bg-[#ffb599] group-hover:text-[#171119]"}`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="font-medium text-[#ecdfeb]">{option.text}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {selectedOptionId && question && (
                  <p className="mt-8 text-center text-sm font-bold text-[#e4bfb1]">
                    {answerResult === "correct"
                      ? "Đúng! Chuẩn bị cho câu hỏi tiếp theo ngay sau đây."
                      : answerResult === "wrong"
                        ? `Sai rồi. Đáp án đúng là: ${question.options.find((opt) => opt.id === correctOptionId)?.text ?? "..."}`
                        : "Đã gửi câu trả lời. Đang chờ kết quả..."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .dragon-lane-gradient {
          background: linear-gradient(90deg, rgba(23, 17, 25, 0) 0%, rgba(255, 95, 5, 0.05) 100%);
        }
        .flame-trail {}
        .glass-panel {
          background: rgba(36, 29, 38, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(170, 137, 125, 0.2);
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(8px, -4px); }
          100% { transform: translate(0, 0); }
        }
        .animate-drift { animation: drift 4s ease-in-out infinite; }
        @keyframes tail-segment-wave {
          0%, 100% { transform: translateY(5px); }
          50% { transform: translateY(-5px); }
        }
        .dragon-tail-svg {
          animation: dragon-tail-wave 2.6s ease-in-out infinite;
          transform-origin: right center;
        }
        .btn-game:active { transform: scale(0.97) translateY(1px); }
        .btn-game:hover { transform: scale(1.02); }
        .correct-toast {
          animation: floatUp 1.2s ease-out forwards;
        }
        .particle {
          position: absolute;
          pointer-events: none;
          background: #4ade80;
          border-radius: 50%;
          z-index: 100;
        }
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-30px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
