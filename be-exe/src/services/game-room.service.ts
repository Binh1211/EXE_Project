import mongoose from "mongoose";
import { GameRoom, Quiz, User } from "../models/index.js";

export class GameRoomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function validateObjectId(id: string, label: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new GameRoomError(400, `${label} không hợp lệ.`);
  }
}

function generateRoomCode(length = 6) {
  return Array.from({ length }, () =>
    ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]
  ).join("");
}

export async function createUniqueRoomCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const roomCode = generateRoomCode();
    const exists = await GameRoom.exists({ roomCode });
    if (!exists) return roomCode;
  }

  throw new GameRoomError(500, "Không tạo được mã phòng.");
}

export async function createGameRoom(input: { quizId: string; userId: string }) {
  validateObjectId(input.quizId, "Quiz ID");
  validateObjectId(input.userId, "User ID");

  const [quiz, user] = await Promise.all([
    Quiz.findById(input.quizId).lean(),
    User.findById(input.userId).lean(),
  ]);

  if (!quiz) throw new GameRoomError(404, "Quiz không tồn tại.");
  if (!user) throw new GameRoomError(404, "Người dùng không tồn tại.");

  const room = await GameRoom.create({
    roomCode: await createUniqueRoomCode(),
    hostId: user._id,
    quizId: quiz._id,
    currentQuestionIndexForPlayers: [0],
    players: [
      {
        userId: user._id,
        username: user.displayName,
        isReady: true,
      },
    ],
  });

  return room;
}

export async function getGameRoomByCode(roomCode: string) {
  const room = await GameRoom.findOne({ roomCode: roomCode.toUpperCase() }).lean();
  if (!room) throw new GameRoomError(404, "Không tìm thấy phòng.");
  return room;
}

export function toGameRoomDto(room: any) {
  return {
    id: String(room._id),
    roomCode: room.roomCode,
    hostId: String(room.hostId),
    quizId: String(room.quizId),
    status: room.status,
    maxPlayers: room.maxPlayers,
    currentQuestionIndexForPlayers: (room.currentQuestionIndexForPlayers ?? []).map(
      (index: number) => index,
    ),
    startedAt: room.startedAt,
    endedAt: room.endedAt,
    players: (room.players ?? []).map((player: any) => ({
      userId: String(player.userId),
      username: player.username,
      score: player.score ?? 0,
      correctAnswers: player.correctAnswers ?? 0,
      finishedAt: player.finishedAt,
      isReady: Boolean(player.isReady),
    })),
  };
}
