import type { Server, Socket } from "socket.io";
import { GameRoom, LeaderboardEntry, Quiz, User } from "../models/index.js";
import { createGameRoom, toGameRoomDto } from "../services/game-room.service.js";
import { verifyAccessToken } from "../utils/jwt.js";

const QUESTION_TIME_LIMIT_MS = 15_000;
const SPEED_BONUS_LIMIT_MS = 3_000;
const BASE_SCORE = 100;
const SPEED_BONUS = 50;

type AuthedSocket = Socket & {
  user?: {
    id: string;
    displayName: string;
  };
};

type QuestionState = {
  answeredUserIds: Set<string>;
  timer?: NodeJS.Timeout;
};

const questionStates = new Map<string, QuestionState>();

function getQuestionKey(roomCode: string, questionIndex: number, playerId?: string) {
  return playerId
    ? `${roomCode}:${playerId}:${questionIndex}`
    : `${roomCode}:${questionIndex}`;
}

function getQuestionId(question: any) {
  return String(question.questionId ?? question._id);
}

function getOptionId(option: any) {
  return String(option.id ?? option._id);
}

function toClientQuestion(question: any, index: number, total: number) {
  return {
    questionId: getQuestionId(question),
    index,
    total,
    text: question.text,
    imageUrl: question.imageUrl,
    options: (question.options ?? []).map((option: any) => ({
      id: getOptionId(option),
      text: option.text,
    })),
    timeLimit: QUESTION_TIME_LIMIT_MS / 1000,
  };
}

function getPlayerRoomIndex(room: any, userId: string) {
  return (room.players ?? []).findIndex(
    (player: any) => String(player.userId) === userId,
  );
}

function getPlayerQuestionIndex(room: any, userId: string) {
  const playerIndex = getPlayerRoomIndex(room, userId);
  if (playerIndex < 0) return 0;
  return (room.currentQuestionIndexForPlayers ?? [])[playerIndex] ?? 0;
}

function setPlayerQuestionIndex(room: any, userId: string, nextIndex: number) {
  const playerIndex = getPlayerRoomIndex(room, userId);
  if (playerIndex < 0) return;
  if (!Array.isArray(room.currentQuestionIndexForPlayers)) {
    room.currentQuestionIndexForPlayers = [];
  }
  room.currentQuestionIndexForPlayers[playerIndex] = nextIndex;
}

function withPositions(players: any[], questionCount: number) {
  const maxScore = Math.max(questionCount * (BASE_SCORE + SPEED_BONUS), 1);
  return players.map((player) => ({
    userId: String(player.userId),
    username: player.username,
    score: player.score ?? 0,
    correctAnswers: player.correctAnswers ?? 0,
    isReady: Boolean(player.isReady),
    position: Math.min(100, Math.round(((player.score ?? 0) / maxScore) * 100)),
  }));
}

function getLeaderboard(room: any, onlyFinished = false) {
  const players = onlyFinished
    ? [...(room.players ?? [])].filter((player: any) => Boolean(player.finishedAt))
    : [...(room.players ?? [])];

  const sortedPlayers = players.sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;

    const finishedA = a.finishedAt ? new Date(a.finishedAt).getTime() : Number.MAX_SAFE_INTEGER;
    const finishedB = b.finishedAt ? new Date(b.finishedAt).getTime() : Number.MAX_SAFE_INTEGER;
    return finishedA - finishedB;
  });

  return sortedPlayers.map((player, index) => ({
    rank: index + 1,
    userId: String(player.userId),
    name: player.username,
    score: player.score ?? 0,
    correctAnswers: player.correctAnswers ?? 0,
  }));
}

async function emitLeaderboardUpdate(io: Server, roomCode: string, onlyFinished = false) {
  const room = await GameRoom.findOne({ roomCode }).lean();
  if (!room) return;

  io.to(roomCode).emit("leaderboard-update", {
    leaderboard: getLeaderboard(room, onlyFinished),
  });
}

async function emitLeaderboardUpdateToSocket(socket: AuthedSocket, roomCode: string, onlyFinished = false) {
  const room = await GameRoom.findOne({ roomCode }).lean();
  if (!room) return;

  socket.emit("leaderboard-update", {
    leaderboard: getLeaderboard(room, onlyFinished),
  });
}

async function getRoomWithQuiz(roomCode: string) {
  const room = await GameRoom.findOne({ roomCode: roomCode.toUpperCase() });
  if (!room) throw new Error("Không tìm thấy phòng.");

  const quiz = await Quiz.findById(room.quizId).lean();
  if (!quiz) throw new Error("Quiz không tồn tại.");

  return { room, quiz };
}

async function emitRoomUpdated(io: Server, roomCode: string) {
  const room = await GameRoom.findOne({ roomCode }).lean();
  if (room) {
    io.to(roomCode).emit("room-updated", toGameRoomDto(room));
  }
}

async function emitRaceUpdate(io: Server, roomCode: string, questionCount: number) {
  const room = await GameRoom.findOne({ roomCode }).lean();
  if (room) {
    io.to(roomCode).emit("race-update", {
      players: withPositions(room.players ?? [], questionCount),
    });
  }
}

async function emitCurrentQuestionToSocket(socket: AuthedSocket, roomCode: string) {
  const { room, quiz } = await getRoomWithQuiz(roomCode);
  const playerId = socket.user?.id ?? "";
  const questionIndex = getPlayerQuestionIndex(room, playerId);
  const question = (quiz.questions ?? [])[questionIndex];

  if (room.status === "playing" && question) {
    socket.emit("next-question", {
      question: toClientQuestion(question, questionIndex, (quiz.questions ?? []).length),
    });
  }
}

async function updateLeaderboard(room: any) {
  const sortedPlayers = [...(room.players ?? [])].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );
  const winner = sortedPlayers[0];

  await Promise.all(
    sortedPlayers.map((player) =>
      LeaderboardEntry.findOneAndUpdate(
        { userId: player.userId, period: "alltime" },
        {
          $inc: {
            quizzesPassed: 1,
            ...(winner && String(winner.userId) === String(player.userId)
              ? { groupSessionsWon: 1 }
              : {}),
          },
          $setOnInsert: {
            userId: player.userId,
            period: "alltime",
          },
        },
        { upsert: true, new: true },
      ),
    ),
  );
}

async function finishRoom(io: Server, roomCode: string) {
  const room = await GameRoom.findOneAndUpdate(
    { roomCode },
    { status: "finished", endedAt: new Date() },
    { new: true },
  ).lean();
  if (!room) return;

  await updateLeaderboard(room);

  const leaderboard = [...(room.players ?? [])]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .map((player, index) => ({
      rank: index + 1,
      userId: String(player.userId),
      name: player.username,
      score: player.score ?? 0,
      correctAnswers: player.correctAnswers ?? 0,
    }));

  io.to(roomCode).emit("game-finished", { leaderboard });
  await emitRoomUpdated(io, roomCode);
}

async function sendNextQuestion(io: Server, roomCode: string) {
  const { room, quiz } = await getRoomWithQuiz(roomCode);
  const questions = quiz.questions ?? [];
  const sockets = await io.in(roomCode).fetchSockets();

  await Promise.all(
    sockets.map(async (remoteSocket) => {
      const socket = remoteSocket as unknown as AuthedSocket;
      const playerId = String(socket.user?.id ?? "");
      const questionIndex = getPlayerQuestionIndex(room, playerId);
      const question = questions[questionIndex];
      if (!question) return;

      socket.emit("next-question", {
        question: toClientQuestion(question, questionIndex, questions.length),
      });
    }),
  );

  await emitRaceUpdate(io, roomCode, questions.length);
}

async function startCountdown(io: Server, roomCode: string) {
  const steps = ["3", "2", "1", "GO"];
  for (const step of steps) {
    io.to(roomCode).emit("countdown", { value: step });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const room = await GameRoom.findOne({ roomCode });
  if (!room) return;

  room.status = "playing";
  room.startedAt = new Date();
  room.currentQuestionIndexForPlayers = (room.players ?? []).map(() => 0);
  await room.save();
  await sendNextQuestion(io, roomCode);

  await emitRoomUpdated(io, roomCode);
  await sendNextQuestion(io, roomCode);
}

function emitSocketError(socket: Socket, message: string) {
  socket.emit("game-error", { message });
}

export function registerGameRoomSocket(io: Server) {
  io.use(async (socket: AuthedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token || typeof token !== "string") {
        throw new Error("Yêu cầu đăng nhập.");
      }

      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.sub).lean();
      if (!user) throw new Error("Người dùng không tồn tại.");

      socket.user = {
        id: String(user._id),
        displayName: user.displayName,
      };
      next();
    } catch (error) {
      next(error instanceof Error ? error : new Error("Token không hợp lệ."));
    }
  });

  io.on("connection", (socket: AuthedSocket) => {
    socket.on("create-room", async (payload: { quizId?: string }) => {
      try {
        if (!socket.user || !payload.quizId) throw new Error("Dữ liệu tạo phòng không hợp lệ.");
        const room = await createGameRoom({
          quizId: payload.quizId,
          userId: socket.user.id,
        });
        socket.join(room.roomCode);
        socket.emit("room-created", { roomCode: room.roomCode });
        await emitRoomUpdated(io, room.roomCode);
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : "Không tạo được phòng.");
      }
    });

    socket.on("join-room", async ({ roomCode }: { roomCode?: string }) => {
      try {
        if (!socket.user || !roomCode) throw new Error("Mã phòng không hợp lệ.");
        const code = roomCode.toUpperCase();
        const room = await GameRoom.findOne({ roomCode: code });
        if (!room) throw new Error("Không tìm thấy phòng.");

        const alreadyJoined = room.players.some(
          (player: any) => String(player.userId) === socket.user?.id,
        );
        if (!alreadyJoined && room.status !== "waiting") throw new Error("Phòng đã bắt đầu.");
        if (!alreadyJoined && (room.players ?? []).length >= room.maxPlayers) {
          throw new Error("Phòng đã đầy.");
        }

        if (!alreadyJoined) {
          room.players.push({
            userId: socket.user.id as any,
            username: socket.user.displayName,
            isReady: String(room.hostId) === socket.user.id,
          } as any);
          room.currentQuestionIndexForPlayers = [
            ...((room.currentQuestionIndexForPlayers ?? []) as number[]),
            0,
          ];
          await room.save();
        }

        socket.join(code);
        await emitRoomUpdated(io, code);
        await emitCurrentQuestionToSocket(socket, code);
        await emitLeaderboardUpdateToSocket(socket, code);
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : "Không vào được phòng.");
      }
    });

    socket.on("request-leaderboard", async ({ roomCode, onlyFinished }: { roomCode?: string; onlyFinished?: boolean }) => {
      try {
        if (!socket.user || !roomCode) throw new Error("Mã phòng không hợp lệ.");
        const code = roomCode.toUpperCase();
        await emitLeaderboardUpdateToSocket(socket, code, Boolean(onlyFinished));
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : "Không lấy được bảng xếp hạng.");
      }
    });

    socket.on("ready-room", async ({ roomCode }: { roomCode?: string }) => {
      try {
        if (!socket.user || !roomCode) throw new Error("Mã phòng không hợp lệ.");
        const code = roomCode.toUpperCase();
        const room = await GameRoom.findOne({ roomCode: code });
        if (!room) throw new Error("Không tìm thấy phòng.");
        if (room.status !== "waiting") throw new Error("Phòng đã bắt đầu.");

        const player = room.players.find(
          (item: any) => String(item.userId) === socket.user?.id,
        );
        if (!player) throw new Error("Bạn chưa tham gia phòng.");

        player.isReady = true;
        await room.save();
        await emitRoomUpdated(io, code);
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : "Không cập nhật được ready.");
      }
    });

    socket.on("start-game", async ({ roomCode }: { roomCode?: string }) => {
      try {
        if (!socket.user || !roomCode) throw new Error("Mã phòng không hợp lệ.");
        const code = roomCode.toUpperCase();
        const room = await GameRoom.findOne({ roomCode: code });
        if (!room) throw new Error("Không tìm thấy phòng.");
        if (String(room.hostId) !== socket.user.id) throw new Error("Chỉ chủ phòng được bắt đầu.");
        if ((room.players ?? []).length < 2) throw new Error("Cần ít nhất 2 người chơi.");
        if (!room.players.every((player: any) => player.isReady)) {
          throw new Error("Tất cả người chơi cần sẵn sàng.");
        }

        room.status = "countdown";
        await room.save();
        await emitRoomUpdated(io, code);
        void startCountdown(io, code);
      } catch (error) {
        emitSocketError(socket, error instanceof Error ? error.message : "Không bắt đầu được game.");
      }
    });

    socket.on(
      "submit-answer",
      async ({
        roomCode,
        questionId,
        optionId,
        timeTaken,
      }: {
        roomCode?: string;
        questionId?: string;
        optionId?: string;
        timeTaken?: number;
      }) => {
        try {
          if (!socket.user || !roomCode || !questionId) {
            throw new Error("Câu trả lời không hợp lệ.");
          }

          const code = roomCode.toUpperCase();
          const { room, quiz } = await getRoomWithQuiz(code);
          if (room.status !== "playing") throw new Error("Game chưa bắt đầu.");

          const playerId = socket.user.id;
          const questionIndex = getPlayerQuestionIndex(room, playerId);
          const question = (quiz.questions ?? [])[questionIndex];
          if (!question || getQuestionId(question) !== questionId) {
            throw new Error("Câu hỏi không hợp lệ.");
          }

          const player = room.players.find(
            (item: any) => String(item.userId) === playerId,
          );
          if (!player) throw new Error("Bạn chưa tham gia phòng.");

          const correctOption = (question.options ?? []).find((opt: any) =>
            String(opt.id ?? opt._id) === String(question.correctOptionId),
          );
          const correctOptionId = getOptionId(correctOption ?? (question.options ?? [])[0]);
          const selectedOptionId = optionId ? String(optionId).trim() : null;
          const isCorrect = selectedOptionId !== null && selectedOptionId === correctOptionId;

          let speedBonus = 0;
          let scoreGained = 0;

          if (isCorrect) {
            scoreGained = BASE_SCORE;
            if (typeof timeTaken === "number" && timeTaken <= SPEED_BONUS_LIMIT_MS) {
              speedBonus = SPEED_BONUS;
              scoreGained += SPEED_BONUS;
            }
            player.score = (player.score ?? 0) + scoreGained;
            player.correctAnswers = (player.correctAnswers ?? 0) + 1;
          }

          const nextQuestionIndex = questionIndex + 1;
          setPlayerQuestionIndex(room, playerId, nextQuestionIndex);
          if (nextQuestionIndex >= (quiz.questions ?? []).length) {
            player.finishedAt = new Date();
          }

          await room.save();
          await emitRaceUpdate(io, code, (quiz.questions ?? []).length);
          await emitLeaderboardUpdate(io, code);

          const leaderboard = getLeaderboard(room, true);
          socket.emit("answer-result", {
            questionId,
            isCorrect,
            correctOptionId,
            scoreGained,
            speedBonus,
          });

          if (nextQuestionIndex < (quiz.questions ?? []).length) {
            const nextQuestion = (quiz.questions ?? [])[nextQuestionIndex];
            setTimeout(() => {
              socket.emit("next-question", {
                question: toClientQuestion(nextQuestion, nextQuestionIndex, (quiz.questions ?? []).length),
              });
            }, 1500);
          } else {
            socket.emit("player-finished", { leaderboard });
            if (room.players.every((p: any) =>
              (room.currentQuestionIndexForPlayers ?? [])[getPlayerRoomIndex(room, String(p.userId))] >=
              (quiz.questions ?? []).length,
            )) {
              await finishRoom(io, code);
            }
          }
        } catch (error) {
          emitSocketError(socket, error instanceof Error ? error.message : "Không gửi được câu trả lời.");
        }
      },
    );
  });
}
