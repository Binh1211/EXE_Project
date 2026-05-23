import mongoose from "mongoose";
import { Quiz, Lesson } from "../models/index.js";

export class QuizError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new QuizError(400, "ID không hợp lệ.");
  }
}

async function ensureLessonExists(lessonId: string) {
  validateObjectId(lessonId);
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new QuizError(404, "Bài học không tồn tại.");
  }
}

export async function getAllQuizzes(filters: { lessonId?: string } = {}) {
  const query: Record<string, unknown> = {};
  if (filters.lessonId) {
    validateObjectId(filters.lessonId);
    query.lessonId = new mongoose.Types.ObjectId(filters.lessonId);
  }
  return await Quiz.find(query).sort({ createdAt: -1 });
}

export async function getQuizById(id: string) {
  validateObjectId(id);
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new QuizError(404, "Không tìm thấy quiz.");
  return quiz;
}

export async function getQuizzesByLesson(lessonId: string) {
  validateObjectId(lessonId);
  await ensureLessonExists(lessonId);
  return await Quiz.find({ lessonId: new mongoose.Types.ObjectId(lessonId) }).sort({ createdAt: -1 });
}

export async function createQuiz(input: {
  lessonId: string;
  title: string;
  passingScore?: number;
  timeLimitSec?: number;
  questions?: Array<unknown>;
}) {
  await ensureLessonExists(input.lessonId);
  return await Quiz.create({
    lessonId: new mongoose.Types.ObjectId(input.lessonId),
    title: input.title.trim(),
    passingScore: input.passingScore ?? 90,
    timeLimitSec: input.timeLimitSec,
    questions: input.questions ?? [],
  });
}

export async function updateQuiz(
  id: string,
  updates: {
    lessonId?: string;
    title?: string;
    passingScore?: number;
    timeLimitSec?: number;
    questions?: Array<unknown>;
  },
) {
  validateObjectId(id);
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new QuizError(404, "Không tìm thấy quiz.");

  if (updates.lessonId) {
    await ensureLessonExists(updates.lessonId);
    quiz.lessonId = new mongoose.Types.ObjectId(updates.lessonId);
  }
  if (updates.title !== undefined) quiz.title = updates.title.trim();
  if (updates.passingScore !== undefined) quiz.passingScore = updates.passingScore;
  if (updates.timeLimitSec !== undefined) quiz.timeLimitSec = updates.timeLimitSec;
  if (updates.questions !== undefined) quiz.set("questions", updates.questions as any);

  await quiz.save();
  return quiz;
}

export async function deleteQuiz(id: string) {
  validateObjectId(id);
  const deleted = await Quiz.findByIdAndDelete(id);
  if (!deleted) throw new QuizError(404, "Không tìm thấy quiz.");
  return { message: "Quiz đã được xóa." };
}
