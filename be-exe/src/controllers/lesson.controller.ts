import type { Request, Response } from "express";
import { z } from "zod";
import {
  createLesson,
  deleteLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
} from "../services/lesson.service.js";

const lessonVideoSchema = z.object({
  url: z.string().min(1, "URL video không được để trống.").optional(),
  provider: z.enum(["youtube", "vimeo", "s3"]).optional(),
  durationSec: z.number().int().nonnegative().optional(),
  thumbnailUrl: z.string().optional(),
});

const lessonSchema = z.object({
  chapterId: z.string().min(1, "ID chương không được để trống."),
  title: z.string().min(1, "Tiêu đề bài học không được để trống."),
  order: z.number().int().nonnegative("Thứ tự phải là số nguyên không âm."),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  coverImageUrl: z.string().optional(),
  video: lessonVideoSchema.optional(),
});

const lessonUpdateSchema = lessonSchema.partial();

export async function listLessons(req: Request, res: Response) {
  const chapterId = typeof req.query.chapterId === "string" ? req.query.chapterId : undefined;
  const lessons = await getAllLessons({ chapterId });
  res.json(lessons);
}

export async function getLesson(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const lesson = await getLessonById(id);
  res.json(lesson);
}

export async function createLessonHandler(req: Request, res: Response) {
  const data = lessonSchema.parse(req.body);
  const lesson = await createLesson(data);
  res.status(201).json(lesson);
}

export async function updateLessonHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = lessonUpdateSchema.parse(req.body);
  const lesson = await updateLesson(id, data);
  res.json(lesson);
}

export async function deleteLessonHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteLesson(id);
  res.json(result);
}
