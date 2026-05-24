import type { Response, Request } from "express";
import { z } from "zod";
import {
  createChapter,
  deleteChapter,
  getAllChapters,
  getChapterBySlug,
  getChaptersByTimelineId,
  updateChapter,
} from "../services/chapter.service.js";

const chapterSchema = z.object({
  title: z.string().min(1, "Tiêu đề chương không được để trống."),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  order: z.number().int().min(0, "Thứ tự chương phải là số nguyên không âm."),
  timelineId: z.string().min(1, "ID timeline không được để trống."),
  requiredLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  isPublished: z.boolean().optional(),
  slug: z.string().optional(),
});

const chapterUpdateSchema = chapterSchema.partial();

export async function listChapters(_req: Request, res: Response) {
  const chapters = await getAllChapters();
  res.json(chapters);
}

export async function getChaptersByTimeline(req: Request, res: Response) {
  const timelineId = Array.isArray(req.params.timelineId) ? req.params.timelineId[0] : req.params.timelineId;
  const chapters = await getChaptersByTimelineId(timelineId);
  res.json(chapters);
}

export async function getChapter(req: Request, res: Response) {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const chapter = await getChapterBySlug(slug);
  res.json(chapter);
}

export async function createChapterHandler(req: Request, res: Response) {
  const data = chapterSchema.parse(req.body);
  const chapter = await createChapter(data);
  res.status(201).json(chapter);
}

export async function updateChapterHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = chapterUpdateSchema.parse(req.body);
  const chapter = await updateChapter(id, data);
  res.json(chapter);
}

export async function deleteChapterHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteChapter(id);
  res.json(result);
}
