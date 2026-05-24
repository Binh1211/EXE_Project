import { type Request, type Response } from "express";
import { z } from "zod";
import * as adminService from "../services/admin.service.js";

const createTimelineSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1),
  displayTime: z.string().min(1),
});

const createChapterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  order: z.coerce.number().int().min(1),
  requiredLevel: z.coerce.number().int().min(1).max(3).optional(),
  coverImageUrl: z.string().optional(),
  timelineId: z.string().min(1),
  isPublished: z.boolean().optional(),
});

const createLessonSchema = z.object({
  title: z.string().min(1),
  order: z.coerce.number().int().min(1),
  chapterId: z.string().min(1),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  video: z
    .object({
      url: z.string().optional(),
      provider: z.enum(["youtube", "vimeo", "s3"]).optional(),
      durationSec: z.coerce.number().optional(),
    })
    .optional(),
});

function handleError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra.";
  const status = message.includes("không hợp lệ") ? 400 : 500;
  res.status(status).json({ message });
}

export async function getUsersHandler(_req: Request, res: Response) {
  try {
    const users = await adminService.getUsers();
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  try {
    const user = await adminService.updateUser(req.params.id as string, req.body);
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
}

export async function getTimelinesHandler(_req: Request, res: Response) {
  try {
    const timelines = await adminService.getTimelines();
    res.json(timelines);
  } catch (error) {
    handleError(res, error);
  }
}

export async function createTimelineHandler(req: Request, res: Response) {
  try {
    const payload = createTimelineSchema.parse(req.body);
    const timeline = await adminService.createTimeline(payload);
    res.status(201).json(timeline);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateTimelineHandler(req: Request, res: Response) {
  try {
    const timeline = await adminService.updateTimeline(req.params.id as string, req.body);
    res.json(timeline);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteTimelineHandler(req: Request, res: Response) {
  try {
    await adminService.deleteTimeline(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
}

export async function getChaptersHandler(req: Request, res: Response) {
  try {
    const timelineId = req.query.timelineId as string | undefined;
    const chapters = await adminService.getChapters(timelineId);
    res.json(chapters);
  } catch (error) {
    handleError(res, error);
  }
}

export async function createChapterHandler(req: Request, res: Response) {
  try {
    const payload = createChapterSchema.parse(req.body);
    const chapter = await adminService.createChapter(payload);
    res.status(201).json(chapter);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateChapterHandler(req: Request, res: Response) {
  try {
    const chapter = await adminService.updateChapter(req.params.id as string, req.body);
    res.json(chapter);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteChapterHandler(req: Request, res: Response) {
  try {
    await adminService.deleteChapter(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
}

export async function getLessonsHandler(req: Request, res: Response) {
  try {
    const chapterId = req.query.chapterId as string | undefined;
    const lessons = await adminService.getLessons(chapterId);
    res.json(lessons);
  } catch (error) {
    handleError(res, error);
  }
}

export async function createLessonHandler(req: Request, res: Response) {
  try {
    const payload = createLessonSchema.parse(req.body);
    const lesson = await adminService.createLesson(payload);
    res.status(201).json(lesson);
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateLessonHandler(req: Request, res: Response) {
  try {
    const lesson = await adminService.updateLesson(req.params.id as string, req.body);
    res.json(lesson);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteLessonHandler(req: Request, res: Response) {
  try {
    await adminService.deleteLesson(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
}

export async function getRevenueHandler(_req: Request, res: Response) {
  try {
    const revenue = await adminService.getRevenue();
    res.json(revenue);
  } catch (error) {
    handleError(res, error);
  }
}
