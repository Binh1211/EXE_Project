import mongoose from "mongoose";
import { LeaderboardEntry, User, Group } from "../models/index.js";

export class LeaderboardEntryError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new LeaderboardEntryError(400, "ID không hợp lệ.");
  }
}

export async function listEntries(filters: { period?: string; groupId?: string; userId?: string } = {}) {
  const query: Record<string, unknown> = {};
  if (filters.period) query.period = filters.period;
  if (filters.groupId) {
    validateObjectId(filters.groupId);
    query.groupId = new mongoose.Types.ObjectId(filters.groupId);
  }
  if (filters.userId) {
    validateObjectId(filters.userId);
    query.userId = new mongoose.Types.ObjectId(filters.userId);
  }
  return await LeaderboardEntry.find(query).sort({ rank: 1 });
}

export async function getEntryById(id: string) {
  validateObjectId(id);
  const entry = await LeaderboardEntry.findById(id);
  if (!entry) throw new LeaderboardEntryError(404, "Không tìm thấy leaderboard entry.");
  return entry;
}

export async function createEntry(input: {
  userId: string;
  groupId?: string;
  period?: string;
  rank?: number;
  quizzesPassed?: number;
  lessonsCompleted?: number;
  groupSessionsWon?: number;
}) {
  validateObjectId(input.userId);
  const user = await User.findById(input.userId);
  if (!user) throw new LeaderboardEntryError(404, "Người dùng không tồn tại.");

  const payload: any = {
    userId: new mongoose.Types.ObjectId(input.userId),
    period: input.period ?? "alltime",
    rank: input.rank ?? 0,
    quizzesPassed: input.quizzesPassed ?? 0,
    lessonsCompleted: input.lessonsCompleted ?? 0,
    groupSessionsWon: input.groupSessionsWon ?? 0,
  };

  if (input.groupId) {
    validateObjectId(input.groupId);
    const g = await Group.findById(input.groupId);
    if (!g) throw new LeaderboardEntryError(404, "Group không tồn tại.");
    payload.groupId = new mongoose.Types.ObjectId(input.groupId);
  }

  return await LeaderboardEntry.create(payload);
}

export async function updateEntry(id: string, updates: {
  rank?: number;
  quizzesPassed?: number;
  lessonsCompleted?: number;
  groupSessionsWon?: number;
}) {
  validateObjectId(id);
  const entry = await LeaderboardEntry.findById(id);
  if (!entry) throw new LeaderboardEntryError(404, "Không tìm thấy leaderboard entry.");

  if (updates.rank !== undefined) entry.rank = updates.rank;
  if (updates.quizzesPassed !== undefined) entry.quizzesPassed = updates.quizzesPassed;
  if (updates.lessonsCompleted !== undefined) entry.lessonsCompleted = updates.lessonsCompleted;
  if (updates.groupSessionsWon !== undefined) entry.groupSessionsWon = updates.groupSessionsWon;

  await entry.save();
  return entry;
}

export async function deleteEntry(id: string) {
  validateObjectId(id);
  const deleted = await LeaderboardEntry.findByIdAndDelete(id);
  if (!deleted) throw new LeaderboardEntryError(404, "Không tìm thấy leaderboard entry.");
  return { message: "Leaderboard entry đã được xóa." };
}
