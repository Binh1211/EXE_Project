import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  deleteLessonProgress,
  getLessonProgressById,
  getLessonProgressByLesson,
  getLessonProgressForUser,
  updateLessonProgress,
  upsertLessonProgress,
} from "../services/lesson-progress.service.js";

const lessonProgressCreateSchema = z.object({
  lessonId: z.string().min(1, "ID bài học không được để trống."),
  status: z.enum(["locked", "unlocked", "completed"]).optional(),
  videoWatchedPct: z.number().min(0).max(100).optional(),
  videoCompletedAt: z.preprocess((value) => (value ? new Date(value as string) : undefined), z.date().optional()),
  flashcardsViewed: z.boolean().optional(),
  quizBestScore: z.number().min(0).optional(),
  quizPassed: z.boolean().optional(),
  quizAttempts: z.number().int().min(0).optional(),
  completedAt: z.preprocess((value) => (value ? new Date(value as string) : undefined), z.date().optional()),
});

const lessonProgressUpdateSchema = lessonProgressCreateSchema.omit({ lessonId: true }).partial();

export async function listLessonProgress(req: AuthRequest, res: Response) {
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : undefined;
  const progress = await getLessonProgressForUser(req.userId!, { lessonId });
  res.json(progress);
}

export async function getLessonProgress(req: AuthRequest, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const progress = await getLessonProgressById(req.userId!, id);
  res.json(progress);
}

export async function getLessonProgressByLessonId(req: AuthRequest, res: Response) {
  const lessonId = Array.isArray(req.params.lessonId) ? req.params.lessonId[0] : req.params.lessonId;
  const progress = await getLessonProgressByLesson(req.userId!, lessonId);
  res.json(progress);
}

export async function createLessonProgress(req: AuthRequest, res: Response) {
  const data = lessonProgressCreateSchema.parse(req.body);
  const progress = await upsertLessonProgress(req.userId!, data);
  res.status(201).json(progress);
}

export async function updateLessonProgressHandler(req: AuthRequest, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = lessonProgressUpdateSchema.parse(req.body);
  const progress = await updateLessonProgress(req.userId!, id, data);
  res.json(progress);
}

export async function deleteLessonProgressHandler(req: AuthRequest, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteLessonProgress(req.userId!, id);
  res.json(result);
}
