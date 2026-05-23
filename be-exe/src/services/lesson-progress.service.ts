import mongoose from "mongoose";
import { Lesson, UserLessonProgress } from "../models/index.js";

export class LessonProgressError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new LessonProgressError(400, "ID không hợp lệ.");
  }
}

async function ensureLessonExists(lessonId: string) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new LessonProgressError(404, "Bài học không tồn tại.");
  }
}

export async function getLessonProgressForUser(userId: string, filters: { lessonId?: string } = {}) {
  const query: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (filters.lessonId) {
    validateObjectId(filters.lessonId);
    query.lessonId = new mongoose.Types.ObjectId(filters.lessonId);
  }

  return await UserLessonProgress.find(query).sort({ updatedAt: -1 });
}

export async function getLessonProgressById(userId: string, id: string) {
  validateObjectId(id);

  const progress = await UserLessonProgress.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!progress) {
    throw new LessonProgressError(404, "Không tìm thấy tiến độ bài học.");
  }

  return progress;
}

export async function getLessonProgressByLesson(userId: string, lessonId: string) {
  validateObjectId(lessonId);
  await ensureLessonExists(lessonId);

  const progress = await UserLessonProgress.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    lessonId: new mongoose.Types.ObjectId(lessonId),
  });

  if (!progress) {
    throw new LessonProgressError(404, "Không tìm thấy tiến độ bài học.");
  }

  return progress;
}

export async function upsertLessonProgress(
  userId: string,
  input: {
    lessonId: string;
    status?: "locked" | "unlocked" | "completed";
    videoWatchedPct?: number;
    videoCompletedAt?: Date;
    flashcardsViewed?: boolean;
    quizBestScore?: number;
    quizPassed?: boolean;
    quizAttempts?: number;
    completedAt?: Date;
  },
) {
  validateObjectId(input.lessonId);
  await ensureLessonExists(input.lessonId);

  const update: Record<string, unknown> = {};
  if (input.status !== undefined) update.status = input.status;
  if (input.videoWatchedPct !== undefined) update.videoWatchedPct = input.videoWatchedPct;
  if (input.videoCompletedAt !== undefined) update.videoCompletedAt = input.videoCompletedAt;
  if (input.flashcardsViewed !== undefined) update.flashcardsViewed = input.flashcardsViewed;
  if (input.quizBestScore !== undefined) update.quizBestScore = input.quizBestScore;
  if (input.quizPassed !== undefined) update.quizPassed = input.quizPassed;
  if (input.quizAttempts !== undefined) update.quizAttempts = input.quizAttempts;
  if (input.completedAt !== undefined) update.completedAt = input.completedAt;

  const progress = await UserLessonProgress.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(userId),
      lessonId: new mongoose.Types.ObjectId(input.lessonId),
    },
    {
      $set: update,
      $setOnInsert: {
        userId: new mongoose.Types.ObjectId(userId),
        lessonId: new mongoose.Types.ObjectId(input.lessonId),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  if (!progress) {
    throw new LessonProgressError(500, "Không thể lưu tiến độ bài học.");
  }

  return progress;
}

export async function updateLessonProgress(userId: string, id: string, updates: {
  status?: "locked" | "unlocked" | "completed";
  videoWatchedPct?: number;
  videoCompletedAt?: Date;
  flashcardsViewed?: boolean;
  quizBestScore?: number;
  quizPassed?: boolean;
  quizAttempts?: number;
  completedAt?: Date;
}) {
  validateObjectId(id);

  const updatePayload: Record<string, unknown> = {};
  if (updates.status !== undefined) updatePayload.status = updates.status;
  if (updates.videoWatchedPct !== undefined) updatePayload.videoWatchedPct = updates.videoWatchedPct;
  if (updates.videoCompletedAt !== undefined) updatePayload.videoCompletedAt = updates.videoCompletedAt;
  if (updates.flashcardsViewed !== undefined) updatePayload.flashcardsViewed = updates.flashcardsViewed;
  if (updates.quizBestScore !== undefined) updatePayload.quizBestScore = updates.quizBestScore;
  if (updates.quizPassed !== undefined) updatePayload.quizPassed = updates.quizPassed;
  if (updates.quizAttempts !== undefined) updatePayload.quizAttempts = updates.quizAttempts;
  if (updates.completedAt !== undefined) updatePayload.completedAt = updates.completedAt;

  const progress = await UserLessonProgress.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    },
    {
      $set: updatePayload,
    },
    {
      new: true,
    },
  );

  if (!progress) {
    throw new LessonProgressError(404, "Không tìm thấy tiến độ bài học để cập nhật.");
  }

  return progress;
}

export async function deleteLessonProgress(userId: string, id: string) {
  validateObjectId(id);

  const progress = await UserLessonProgress.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!progress) {
    throw new LessonProgressError(404, "Không tìm thấy tiến độ bài học để xóa.");
  }

  return { message: "Tiến độ bài học đã được xóa." };
}
