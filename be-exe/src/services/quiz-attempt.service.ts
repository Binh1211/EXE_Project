import mongoose from "mongoose";
import { QuizAttempt, Quiz, Lesson, User } from "../models/index.js";

export class QuizAttemptError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new QuizAttemptError(400, "ID không hợp lệ.");
  }
}

async function ensureQuizExists(quizId: string) {
  validateObjectId(quizId);
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new QuizAttemptError(404, "Quiz không tồn tại.");
  return quiz;
}

async function ensureLessonExists(lessonId: string) {
  validateObjectId(lessonId);
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new QuizAttemptError(404, "Bài học không tồn tại.");
  return lesson;
}

export async function listQuizAttempts(filters: { userId?: string; quizId?: string; lessonId?: string } = {}) {
  const query: Record<string, unknown> = {};
  if (filters.userId) {
    validateObjectId(filters.userId);
    query.userId = new mongoose.Types.ObjectId(filters.userId);
  }
  if (filters.quizId) {
    validateObjectId(filters.quizId);
    query.quizId = new mongoose.Types.ObjectId(filters.quizId);
  }
  if (filters.lessonId) {
    validateObjectId(filters.lessonId);
    query.lessonId = new mongoose.Types.ObjectId(filters.lessonId);
  }
  return await QuizAttempt.find(query).sort({ submittedAt: -1 });
}

export async function getQuizAttemptById(id: string) {
  validateObjectId(id);
  const attempt = await QuizAttempt.findById(id);
  if (!attempt) throw new QuizAttemptError(404, "Không tìm thấy QuizAttempt.");
  return attempt;
}

export async function createQuizAttempt(input: {
  userId: string;
  quizId: string;
  lessonId: string;
  score?: number;
  timeTakenSec?: number;
  answers?: Array<unknown>;
}) {
  await ensureQuizExists(input.quizId);
  await ensureLessonExists(input.lessonId);
  validateObjectId(input.userId);

  const quiz = await Quiz.findById(input.quizId);
  const passing = typeof quiz?.passingScore === "number" && typeof input.score === "number" ? input.score >= quiz.passingScore : undefined;
  const xp = typeof input.score === "number" ? Math.floor(input.score) : undefined;

  const created = await QuizAttempt.create({
    userId: new mongoose.Types.ObjectId(input.userId),
    quizId: new mongoose.Types.ObjectId(input.quizId),
    lessonId: new mongoose.Types.ObjectId(input.lessonId),
    score: input.score,
    passed: passing,
    timeTakenSec: input.timeTakenSec,
    answers: input.answers ?? [],
    xpAwarded: xp,
  });

  return created;
}

export async function updateQuizAttempt(
  id: string,
  updates: {
    score?: number;
    passed?: boolean;
    timeTakenSec?: number;
    answers?: Array<unknown>;
    xpAwarded?: number;
  },
) {
  validateObjectId(id);
  const attempt = await QuizAttempt.findById(id);
  if (!attempt) throw new QuizAttemptError(404, "Không tìm thấy QuizAttempt.");

  if (updates.score !== undefined) attempt.score = updates.score;
  if (updates.passed !== undefined) attempt.passed = updates.passed;
  if (updates.timeTakenSec !== undefined) attempt.timeTakenSec = updates.timeTakenSec;
  if (updates.answers !== undefined) attempt.set("answers", updates.answers as any);
  if (updates.xpAwarded !== undefined) attempt.xpAwarded = updates.xpAwarded;

  await attempt.save();
  return attempt;
}

export async function deleteQuizAttempt(id: string) {
  validateObjectId(id);
  const deleted = await QuizAttempt.findByIdAndDelete(id);
  if (!deleted) throw new QuizAttemptError(404, "Không tìm thấy QuizAttempt.");
  return { message: "QuizAttempt đã được xóa." };
}
