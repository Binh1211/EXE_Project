import mongoose from "mongoose";
import { Chapter, Lesson } from "../models/index.js";

export class LessonError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new LessonError(400, "ID bài học không hợp lệ.");
  }
}

async function ensureChapterExists(chapterId: string) {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    throw new LessonError(404, "Chương không tồn tại.");
  }
}

export async function getAllLessons(filters: { chapterId?: string } = {}) {
  const query: Record<string, unknown> = {};

  if (filters.chapterId) {
    validateObjectId(filters.chapterId);
    query.chapterId = filters.chapterId;
  }

  return await Lesson.find(query).sort({ order: 1, createdAt: -1 });
}

export async function getLessonById(id: string) {
  validateObjectId(id);

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new LessonError(404, "Không tìm thấy bài học.");
  }

  return lesson;
}

export async function createLesson(input: {
  chapterId: string;
  title: string;
  order: number;
  isFree?: boolean;
  isPublished?: boolean;
  coverImageUrl?: string;
  video?: {
    url?: string;
    provider?: "youtube" | "vimeo" | "s3";
    durationSec?: number;
    thumbnailUrl?: string;
  };
}) {
  validateObjectId(input.chapterId);
  await ensureChapterExists(input.chapterId);

  const lesson = await Lesson.create({
    chapterId: input.chapterId,
    title: input.title.trim(),
    order: input.order,
    isFree: input.isFree ?? false,
    isPublished: input.isPublished ?? false,
    coverImageUrl: input.coverImageUrl?.trim() || "",
    video: input.video ? {
      url: input.video.url?.trim() || "",
      provider: input.video.provider,
      durationSec: input.video.durationSec,
      thumbnailUrl: input.video.thumbnailUrl?.trim() || "",
    } : undefined,
  });

  return lesson;
}

export async function updateLesson(
  id: string,
  updates: {
    chapterId?: string;
    title?: string;
    order?: number;
    isFree?: boolean;
    isPublished?: boolean;
    coverImageUrl?: string;
    video?: {
      url?: string;
      provider?: "youtube" | "vimeo" | "s3";
      durationSec?: number;
      thumbnailUrl?: string;
    };
  },
) {
  validateObjectId(id);

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new LessonError(404, "Không tìm thấy bài học.");
  }

  const updatesToApply: Record<string, unknown> = {};

  if (updates.chapterId) {
    validateObjectId(updates.chapterId);
    await ensureChapterExists(updates.chapterId);
    updatesToApply.chapterId = new mongoose.Types.ObjectId(updates.chapterId);
  }
  if (updates.title !== undefined) {
    updatesToApply.title = updates.title.trim();
  }
  if (updates.order !== undefined) {
    updatesToApply.order = updates.order;
  }
  if (updates.isFree !== undefined) {
    updatesToApply.isFree = updates.isFree;
  }
  if (updates.isPublished !== undefined) {
    updatesToApply.isPublished = updates.isPublished;
  }
  if (updates.coverImageUrl !== undefined) {
    updatesToApply.coverImageUrl = updates.coverImageUrl.trim();
  }
  if (updates.video !== undefined) {
    updatesToApply.video = {
      url: updates.video.url?.trim() || "",
      provider: updates.video.provider,
      durationSec: updates.video.durationSec,
      thumbnailUrl: updates.video.thumbnailUrl?.trim() || "",
    };
  }

  lesson.set(updatesToApply);
  await lesson.save();
  return lesson;
}

export async function deleteLesson(id: string) {
  validateObjectId(id);

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new LessonError(404, "Không tìm thấy bài học.");
  }

  await lesson.deleteOne();
  return { message: "Bài học đã được xóa thành công." };
}
