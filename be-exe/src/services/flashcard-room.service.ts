import mongoose from "mongoose";
import { FlashcardRoom, User } from "../models/index.js";

export class FlashcardRoomError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createRoom(input: {
  hostId: string;
  title: string;
  timeLimitSec: number;
  questions: any[];
}) {
  const host = await User.findById(input.hostId);
  if (!host) throw new FlashcardRoomError(404, "Host không tồn tại.");
  if (host.level < 3) throw new FlashcardRoomError(403, "Chỉ người dùng level 3 mới có thể tạo phòng.");

  const joinCode = generateJoinCode();

  const room = await FlashcardRoom.create({
    hostId: new mongoose.Types.ObjectId(input.hostId),
    joinCode,
    title: input.title,
    timeLimitSec: input.timeLimitSec,
    questions: input.questions,
    status: "active",
    participants: [],
  });

  return room;
}

export async function getRoomByCode(code: string) {
  const room = await FlashcardRoom.findOne({ joinCode: code.toUpperCase() });
  if (!room) throw new FlashcardRoomError(404, "Không tìm thấy phòng với mã này.");

  // Return safe info (remove correctOptionIndex)
  const safeQuestions = room.questions.map((q: any) => ({
    _id: q._id,
    text: q.text,
    imageUrl: q.imageUrl,
    options: q.options,
    points: q.points,
  }));

  return {
    _id: room._id,
    title: room.title,
    timeLimitSec: room.timeLimitSec,
    status: room.status,
    questions: safeQuestions,
  };
}

export async function submitAnswers(
  code: string,
  userId: string,
  answers: { questionId: string; selectedIndex: number }[],
  timeTakenSec: number
) {
  const room = await FlashcardRoom.findOne({ joinCode: code.toUpperCase() });
  if (!room) throw new FlashcardRoomError(404, "Không tìm thấy phòng.");
  if (room.status !== "active") throw new FlashcardRoomError(400, "Phòng này đã đóng.");

  const user = await User.findById(userId);
  if (!user) throw new FlashcardRoomError(404, "Người chơi không tồn tại.");

  // Check if already submitted
  const exists = room.participants.find((p: any) => p.userId?.toString() === userId);
  if (exists) throw new FlashcardRoomError(400, "Bạn đã nộp bài trong phòng này rồi.");

  // Calculate score
  let score = 0;
  for (const answer of answers) {
    const question: any = room.questions.find((q: any) => q._id.toString() === answer.questionId);
    if (question && question.correctOptionIndex === answer.selectedIndex) {
      score += question.points || 10;
    }
  }

  // Save participant
  room.participants.push({
    userId: new mongoose.Types.ObjectId(userId),
    displayName: user.displayName,
    score,
    timeTakenSec,
    submittedAt: new Date(),
  });

  await room.save();

  return {
    score,
    totalPoints: room.questions.reduce((acc: number, q: any) => acc + (q.points || 10), 0),
    timeTakenSec,
  };
}

export async function getLeaderboard(code: string) {
  const room = await FlashcardRoom.findOne({ joinCode: code.toUpperCase() });
  if (!room) throw new FlashcardRoomError(404, "Không tìm thấy phòng.");

  // Sort by score desc, then timeTaken asc
  const leaderboard = [...room.participants].sort((a: any, b: any) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeTakenSec - b.timeTakenSec;
  });

  return {
    title: room.title,
    status: room.status,
    leaderboard,
  };
}

export async function closeRoom(code: string, hostId: string) {
  const room = await FlashcardRoom.findOne({ joinCode: code.toUpperCase() });
  if (!room) throw new FlashcardRoomError(404, "Không tìm thấy phòng.");
  
  if (room.hostId.toString() !== hostId) {
    throw new FlashcardRoomError(403, "Bạn không phải chủ phòng.");
  }

  room.status = "closed";
  await room.save();
  return { message: "Phòng đã đóng." };
}
