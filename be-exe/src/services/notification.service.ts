import mongoose from "mongoose";
import { Notification } from "../models/index.js";

export class NotificationError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotificationError(400, "ID không hợp lệ.");
  }
}

export async function getNotificationsForUser(userId: string, filter: { isRead?: boolean } = {}) {
  validateObjectId(userId);

  const query: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (filter.isRead !== undefined) {
    query.isRead = filter.isRead;
  }

  return await Notification.find(query).sort({ createdAt: -1 });
}

export async function getNotificationById(userId: string, id: string) {
  validateObjectId(userId);
  validateObjectId(id);

  const notification = await Notification.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!notification) {
    throw new NotificationError(404, "Không tìm thấy thông báo.");
  }

  return notification;
}

export async function createNotification(userId: string, input: {
  type: "lesson_unlocked" | "group_invite" | "rank_changed" | "payment";
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead?: boolean;
}) {
  validateObjectId(userId);

  return await Notification.create({
    userId: new mongoose.Types.ObjectId(userId),
    type: input.type,
    title: input.title.trim(),
    body: input.body.trim(),
    data: input.data ?? {},
    isRead: input.isRead ?? false,
  });
}

export async function updateNotification(
  userId: string,
  id: string,
  updates: {
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
    isRead?: boolean;
  },
) {
  validateObjectId(userId);
  validateObjectId(id);

  const notification = await Notification.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!notification) {
    throw new NotificationError(404, "Không tìm thấy thông báo.");
  }

  if (updates.title !== undefined) notification.title = updates.title.trim();
  if (updates.body !== undefined) notification.body = updates.body.trim();
  if (updates.data !== undefined) notification.data = updates.data;
  if (updates.isRead !== undefined) notification.isRead = updates.isRead;

  await notification.save();
  return notification;
}

export async function deleteNotification(userId: string, id: string) {
  validateObjectId(userId);
  validateObjectId(id);

  const deleted = await Notification.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!deleted) {
    throw new NotificationError(404, "Không tìm thấy thông báo.");
  }

  return { message: "Thông báo đã được xóa." };
}
