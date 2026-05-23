import mongoose from "mongoose";
import { GroupGameSession, Group, Quiz, User } from "../models/index.js";

export class GroupGameSessionError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new GroupGameSessionError(400, "ID không hợp lệ.");
  }
}

export async function listSessions(filters: { groupId?: string; status?: string } = {}) {
  const query: Record<string, unknown> = {};
  if (filters.groupId) {
    validateObjectId(filters.groupId);
    query.groupId = new mongoose.Types.ObjectId(filters.groupId);
  }
  if (filters.status) {
    query.status = filters.status;
  }
  return await GroupGameSession.find(query).sort({ createdAt: -1 });
}

export async function getSessionById(id: string) {
  validateObjectId(id);
  const session = await GroupGameSession.findById(id);
  if (!session) throw new GroupGameSessionError(404, "Không tìm thấy phiên chơi.");
  return session;
}

async function ensureGroupExists(groupId: string) {
  validateObjectId(groupId);
  const group = await Group.findById(groupId);
  if (!group) throw new GroupGameSessionError(404, "Group không tồn tại.");
}

async function ensureQuizExists(quizId: string) {
  validateObjectId(quizId);
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new GroupGameSessionError(404, "Quiz không tồn tại.");
}

export async function createSession(input: {
  groupId: string;
  quizId: string;
  hostId: string;
  joinCode?: string;
  xpMultiplier?: number;
}) {
  await ensureGroupExists(input.groupId);
  await ensureQuizExists(input.quizId);
  validateObjectId(input.hostId);

  const payload: any = {
    groupId: new mongoose.Types.ObjectId(input.groupId),
    quizId: new mongoose.Types.ObjectId(input.quizId),
    hostId: new mongoose.Types.ObjectId(input.hostId),
    status: "waiting",
    joinCode: input.joinCode ?? Math.random().toString(36).substring(2, 8).toUpperCase(),
    xpMultiplier: input.xpMultiplier ?? 1.5,
    participants: [{ userId: new mongoose.Types.ObjectId(input.hostId), score: 0, rank: 0 }],
  };

  return await GroupGameSession.create(payload);
}

export async function updateSession(id: string, updates: {
  status?: "waiting" | "active" | "ended";
  startedAt?: Date | null;
  endedAt?: Date | null;
  xpMultiplier?: number;
}) {
  validateObjectId(id);
  const session = await GroupGameSession.findById(id);
  if (!session) throw new GroupGameSessionError(404, "Không tìm thấy phiên chơi.");

  if (updates.status !== undefined) session.status = updates.status;
  if (updates.startedAt !== undefined) session.startedAt = updates.startedAt;
  if (updates.endedAt !== undefined) session.endedAt = updates.endedAt;
  if (updates.xpMultiplier !== undefined) session.xpMultiplier = updates.xpMultiplier;

  await session.save();
  return session;
}

export async function addParticipant(sessionId: string, userId: string) {
  validateObjectId(sessionId);
  validateObjectId(userId);
  const session = await GroupGameSession.findById(sessionId);
  if (!session) throw new GroupGameSessionError(404, "Không tìm thấy phiên chơi.");
  const user = await User.findById(userId);
  if (!user) throw new GroupGameSessionError(404, "Người dùng không tồn tại.");

  const exists = session.participants.find((p: any) => p.userId?.toString() === userId);
  if (exists) throw new GroupGameSessionError(400, "Người chơi đã tham gia.");

  session.participants.push({ userId: new mongoose.Types.ObjectId(userId), score: 0 });
  await session.save();
  return session;
}

export async function removeParticipant(sessionId: string, userId: string) {
  validateObjectId(sessionId);
  validateObjectId(userId);
  const session = await GroupGameSession.findById(sessionId);
  if (!session) throw new GroupGameSessionError(404, "Không tìm thấy phiên chơi.");

  const before = session.participants.length;
  session.set(
    "participants",
    session.participants.filter((p: any) => p.userId?.toString() !== userId),
  );
  if (session.participants.length === before) throw new GroupGameSessionError(404, "Người chơi không tồn tại trong phiên.");

  await session.save();
  return session;
}

export async function startSession(sessionId: string) {
  validateObjectId(sessionId);
  const session = await GroupGameSession.findById(sessionId);
  if (!session) throw new GroupGameSessionError(404, "Không tìm thấy phiên chơi.");
  session.status = "active";
  session.startedAt = new Date();
  await session.save();
  return session;
}

export async function endSession(sessionId: string) {
  validateObjectId(sessionId);
  const session = await GroupGameSession.findById(sessionId);
  if (!session) throw new GroupGameSessionError(404, "Không tìm thấy phiên chơi.");
  session.status = "ended";
  session.endedAt = new Date();
  await session.save();
  return session;
}

export async function deleteSession(id: string) {
  validateObjectId(id);
  const deleted = await GroupGameSession.findByIdAndDelete(id);
  if (!deleted) throw new GroupGameSessionError(404, "Không tìm thấy phiên chơi.");
  return { message: "Phiên chơi đã bị xóa." };
}
