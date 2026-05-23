import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotificationsForUser,
  updateNotification,
} from "../services/notification.service.js";

const notificationCreateSchema = z.object({
  type: z.enum(["lesson_unlocked", "group_invite", "rank_changed", "payment"]),
  title: z.string().min(1, "Tiêu đề không được để trống."),
  body: z.string().min(1, "Nội dung không được để trống."),
  data: z.record(z.unknown()).optional(),
  isRead: z.boolean().optional(),
});

const notificationUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  data: z.record(z.unknown()).optional(),
  isRead: z.boolean().optional(),
});

export async function listNotifications(req: AuthRequest, res: Response) {
  const isRead = req.query.isRead === "true" ? true : req.query.isRead === "false" ? false : undefined;
  const notifications = await getNotificationsForUser(req.userId!, { isRead });
  res.json(notifications);
}

export async function getNotification(req: AuthRequest, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const notification = await getNotificationById(req.userId!, id);
  res.json(notification);
}

export async function createNotificationHandler(req: AuthRequest, res: Response) {
  const data = notificationCreateSchema.parse(req.body);
  const notification = await createNotification(req.userId!, data);
  res.status(201).json(notification);
}

export async function updateNotificationHandler(req: AuthRequest, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = notificationUpdateSchema.parse(req.body);
  const notification = await updateNotification(req.userId!, id, data);
  res.json(notification);
}

export async function deleteNotificationHandler(req: AuthRequest, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteNotification(req.userId!, id);
  res.json(result);
}
