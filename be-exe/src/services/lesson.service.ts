import mongoose from "mongoose";
import {
  Chapter,
  FaqItem,
  FlashcardSet,
  Lesson,
  Quiz,
  UserLessonProgress,
} from "../models/index.js";

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

type LessonVideoInput = {
  title: string;
  url: string;
  provider?: "youtube" | "vimeo" | "s3";
  order?: number;
  durationSec?: number;
  thumbnailUrl?: string;
};

type LessonInput = {
  chapterId: string;
  title: string;
  description?: string;
  order: number;
  isFree?: boolean;
  isPublished?: boolean;
  coverImageUrl?: string;
  videos?: LessonVideoInput[];
  video?: LessonVideoInput;
  quiz?: string;
  flashcardSetId?: string;
  faqId?: string;
};

type LessonUpdateInput = Partial<LessonInput>;

function normalizeVideos(input: { videos?: LessonVideoInput[]; video?: LessonVideoInput }) {
  const videos = input.videos ?? (input.video ? [input.video] : undefined);

  return videos?.map((video, index) => ({
    title: video.title.trim(),
    url: video.url.trim(),
    provider: video.provider,
    order: video.order ?? index,
    durationSec: video.durationSec,
    thumbnailUrl: video.thumbnailUrl?.trim() || "",
  }));
}

function isProgressCompleted(progress: { status?: string; completedAt?: unknown; quizPassed?: boolean } | undefined) {
  return Boolean(
    progress?.status === "completed" ||
      progress?.completedAt ||
      progress?.quizPassed,
  );
}

async function decorateLessonsWithLocks(lessons: any[], userId?: string) {
  const lessonIds = lessons.map((lesson) => lesson._id);
  const progressByLessonId = new Map<string, any>();

  if (userId && lessonIds.length > 0) {
    const progressList = await UserLessonProgress.find({
      userId: new mongoose.Types.ObjectId(userId),
      lessonId: { $in: lessonIds },
    }).lean();

    for (const progress of progressList) {
      progressByLessonId.set(String(progress.lessonId), progress);
    }
  }

  return lessons.map((lesson, index) => {
    const previousLesson = index > 0 ? lessons[index - 1] : undefined;
    const previousProgress = previousLesson
      ? progressByLessonId.get(String(previousLesson._id))
      : undefined;
    const progress = progressByLessonId.get(String(lesson._id));
    const isLocked = index > 0 && !isProgressCompleted(previousProgress);

    return {
      ...lesson,
      progress,
      isLocked,
      unlockRequirement:
        isLocked && previousLesson
          ? {
              lessonId: previousLesson._id,
              title: previousLesson.title,
              message: "Hoàn thành bài học trước để mở khóa bài này.",
            }
          : undefined,
    };
  });
}

async function assertLessonUnlocked(lesson: any, userId?: string) {
  const previousLesson = await Lesson.findOne({
    chapterId: lesson.chapterId,
    order: { $lt: lesson.order },
  })
    .sort({ order: -1 })
    .lean();

  if (!previousLesson) return;

  if (!userId) {
    throw new LessonError(403, "Bạn cần hoàn thành bài học trước để mở khóa bài này.");
  }

  const previousProgress = await UserLessonProgress.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    lessonId: previousLesson._id,
  }).lean();

  if (!isProgressCompleted(previousProgress ?? undefined)) {
    throw new LessonError(403, "Bạn cần hoàn thành bài học trước để mở khóa bài này.");
  }
}

export async function getAllLessons(filters: { chapterId?: string } = {}, userId?: string) {
  const query: Record<string, unknown> = {};

  if (filters.chapterId) {
    validateObjectId(filters.chapterId);
    query.chapterId = filters.chapterId;
  }

  const lessons = await Lesson.find(query).sort({ order: 1, createdAt: -1 }).lean();
  return await decorateLessonsWithLocks(lessons, userId);
}

export async function getLessonById(id: string, userId?: string) {
  validateObjectId(id);

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new LessonError(404, "Không tìm thấy bài học.");
  }

  await assertLessonUnlocked(lesson, userId);

  return lesson;
}

export async function getLessonDetail(id: string, userId?: string) {
  validateObjectId(id);

  const lesson = await Lesson.findById(id).lean();
  if (!lesson) {
    throw new LessonError(404, "Không tìm thấy bài học.");
  }

  await assertLessonUnlocked(lesson, userId);

  const lessonObjectId = new mongoose.Types.ObjectId(id);

  const [quiz, flashcardSet, faqItems, progress] = await Promise.all([
    lesson.quiz
      ? Quiz.findById(lesson.quiz).lean()
      : Quiz.findOne({ lessonId: lessonObjectId }).lean(),
    lesson.flashcardSetId
      ? FlashcardSet.findById(lesson.flashcardSetId).lean()
      : FlashcardSet.findOne({ lessonId: lessonObjectId }).lean(),
    FaqItem.find({ lessonId: lessonObjectId, isActive: { $ne: false } })
      .sort({ order: 1 })
      .lean(),
    userId
      ? UserLessonProgress.findOne({
          userId: new mongoose.Types.ObjectId(userId),
          lessonId: lessonObjectId,
        }).lean()
      : null,
  ]);

  const [decorated] = await decorateLessonsWithLocks([lesson], userId);

  return {
    ...decorated,
    quizData: quiz ?? null,
    flashcardSet: flashcardSet ?? null,
    faqItems: faqItems ?? [],
    progress: progress ?? decorated.progress ?? null,
  };
}

export async function createLesson(input: LessonInput) {
  validateObjectId(input.chapterId);
  await ensureChapterExists(input.chapterId);

  const lesson = await Lesson.create({
    chapterId: input.chapterId,
    title: input.title.trim(),
    description: input.description?.trim() || "",
    order: input.order,
    isFree: input.isFree ?? false,
    isPublished: input.isPublished ?? false,
    coverImageUrl: input.coverImageUrl?.trim() || "",
    videos: normalizeVideos(input) ?? [],
    quiz: input.quiz,
    flashcardSetId: input.flashcardSetId,
    faqId: input.faqId,
  });

  return lesson;
}

export async function updateLesson(id: string, updates: LessonUpdateInput) {
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
  if (updates.description !== undefined) {
    updatesToApply.description = updates.description.trim();
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
  if (updates.videos !== undefined || updates.video !== undefined) {
    updatesToApply.videos = normalizeVideos(updates) ?? [];
  }
  if (updates.quiz !== undefined) {
    updatesToApply.quiz = updates.quiz;
  }
  if (updates.flashcardSetId !== undefined) {
    updatesToApply.flashcardSetId = updates.flashcardSetId;
  }
  if (updates.faqId !== undefined) {
    updatesToApply.faqId = updates.faqId;
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
