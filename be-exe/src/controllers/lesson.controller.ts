import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { z } from "zod";
import {
  createLesson,
  deleteLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
} from "../services/lesson.service.js";

const lessonVideoSchema = z.object({
  title: z.string().min(1, "Tiêu đề video không được để trống."),
  url: z.string().min(1, "URL video không được để trống."),
  provider: z.enum(["youtube", "vimeo", "s3"]).optional(),
  order: z.number().int().nonnegative().optional(),
  durationSec: z.number().int().nonnegative().optional(),
  thumbnailUrl: z.string().optional(),
});

const quizOptionSchema = z.object({
  _id: z.string().optional(),
  text: z.string().min(1, "Nội dung đáp án không được để trống."),
});

const quizQuestionSchema = z.object({
  _id: z.string().optional(),
  type: z.enum(["mc", "truefalse"]),
  text: z.string().min(1, "Nội dung câu hỏi không được để trống."),
  imageUrl: z.string().optional(),
  options: z.array(quizOptionSchema).optional(),
  correctOptionId: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().int().min(0).optional(),
});

const lessonQuizSchema = z.object({
  title: z.string().min(1, "Tiêu đề quiz không được để trống."),
  passingScore: z.number().int().min(0).max(100).optional(),
  timeLimitSec: z.number().int().nonnegative().optional(),
  questions: z.array(quizQuestionSchema).optional(),
});

const lessonSchema = z.object({
  chapterId: z.string().min(1, "ID chương không được để trống."),
  title: z.string().min(1, "Tiêu đề bài học không được để trống."),
  description: z.string().optional(),
  order: z.number().int().nonnegative("Thứ tự phải là số nguyên không âm."),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  coverImageUrl: z.string().optional(),
  videos: z.array(lessonVideoSchema).optional(),
  video: lessonVideoSchema.optional(),
  quiz: lessonQuizSchema.optional(),
});

const lessonUpdateSchema = lessonSchema.partial();

function getOptionalUserId(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;

  try {
    return verifyAccessToken(header.slice(7)).sub;
  } catch {
    return undefined;
  }
}

export async function listLessons(req: Request, res: Response) {
  const chapterId = typeof req.query.chapterId === "string" ? req.query.chapterId : undefined;
  const lessons = await getAllLessons({ chapterId }, getOptionalUserId(req));
  res.json(lessons);
}

export async function getLesson(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const lesson = await getLessonById(id, getOptionalUserId(req));

  if (!lesson.isFree) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Yêu cầu đăng nhập để xem bài học này." });
      return;
    }
    try {
      const token = header.slice(7);
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.sub);
      if (user?.subscription?.plan !== "level2" && user?.subscription?.plan !== "level3") {
        res.status(403).json({ message: "Bạn cần nâng cấp VIP để xem bài học này." });
        return;
      }
    } catch {
      res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
      return;
    }
  }

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
