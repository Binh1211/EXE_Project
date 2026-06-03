import type { Response, Request } from "express";
import { z } from "zod";
import {
  createTimeline,
  deleteTimeline,
  getAllTimelines,
  getTimelineBySlug,
  updateTimeline,
} from "../services/timeline.service.js";

const createTimelineSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống."),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "URL ảnh không được để trống."),
  displayTime: z.string().min(1, "Thời gian hiển thị không được để trống."),
  slug: z.string().optional(),
  order: z.number().min(0, "Thứ tự không được nhỏ hơn 0."),
  funfacts: z.array(z.string()).optional(),
});

const updateTimelineSchema = createTimelineSchema.partial();

export async function listTimelines(_req: Request, res: Response) {
  const timelines = await getAllTimelines();
  res.json(timelines);
}

export async function getTimeline(req: Request, res: Response) {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const timeline = await getTimelineBySlug(slug);
  res.json(timeline);
}

export async function createTimelineHandler(req: Request, res: Response) {
  const data = createTimelineSchema.parse(req.body);
  const timeline = await createTimeline(data);
  res.status(201).json(timeline);
}

export async function updateTimelineHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = updateTimelineSchema.parse(req.body);
  const timeline = await updateTimeline(id, data);
  res.json(timeline);
}

export async function deleteTimelineHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteTimeline(id);
  res.json(result);
}
