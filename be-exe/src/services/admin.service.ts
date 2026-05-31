import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Chapter } from "../models/Chapter.js";
import { Lesson } from "../models/Lesson.js";
import { Timeline } from "../models/Timeline.js";
import { PaymentTransaction } from "../models/PaymentTransaction.js";

function toObjectId(id: string, label: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`${label} không hợp lệ.`);
  }
  return new mongoose.Types.ObjectId(id);
}

export async function getUsers() {
  return User.find().select("-passwordHash -oauthProviders").sort({ createdAt: -1 }).lean();
}

export async function updateUser(userId: string, data: Partial<{ role: string; level: number; isActive: boolean }>) {
  return User.findByIdAndUpdate(userId, data, { new: true }).select("-passwordHash -oauthProviders").lean();
}

export async function getTimelines() {
  return Timeline.find().sort({ createdAt: 1 }).lean();
}

export async function createTimeline(data: {
  title: string;
  slug?: string;
  description?: string;
  imageUrl: string;
  displayTime: string;
}) {
  const slug =
    data.slug?.trim() ||
    data.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return Timeline.create({ ...data, slug });
}

export async function updateTimeline(id: string, data: Record<string, unknown>) {
  return Timeline.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteTimeline(id: string) {
  const timelineObjectId = toObjectId(id, "Timeline ID");
  const chapters = await Chapter.find({ timelineId: timelineObjectId }).select("_id").lean();

  if (chapters.length > 0) {
    const chapterIds = chapters.map((c) => c._id);
    await Lesson.deleteMany({ chapterId: { $in: chapterIds } });
    await Chapter.deleteMany({ timelineId: timelineObjectId });
  }

  return Timeline.findByIdAndDelete(id);
}

export async function getChapters(timelineId?: string) {
  const query: Record<string, unknown> = {};
  if (timelineId) {
    query.timelineId = toObjectId(timelineId, "Timeline ID");
  }
  return Chapter.find(query).sort({ order: 1 }).lean();
}

export async function createChapter(data: {
  title: string;
  slug?: string;
  description?: string;
  order: number;
  requiredLevel?: number;
  coverImageUrl?: string;
  timelineId: string;
  isPublished?: boolean;
}) {
  const slug =
    data.slug?.trim() ||
    data.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return Chapter.create({
    ...data,
    slug,
    timelineId: toObjectId(data.timelineId, "Timeline ID"),
    requiredLevel: data.requiredLevel ?? 1,
    isPublished: data.isPublished ?? false,
  });
}

export async function updateChapter(id: string, data: Record<string, unknown>) {
  if (typeof data.timelineId === "string") {
    data.timelineId = toObjectId(data.timelineId, "Timeline ID");
  }
  return Chapter.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteChapter(id: string) {
  const chapterObjectId = toObjectId(id, "Chapter ID");
  await Lesson.deleteMany({ chapterId: chapterObjectId });
  return Chapter.findByIdAndDelete(id);
}

export async function getLessons(chapterId?: string) {
  const query: Record<string, unknown> = {};
  if (chapterId) {
    query.chapterId = toObjectId(chapterId, "Chapter ID");
  }
  return Lesson.find(query).sort({ order: 1 }).lean();
}

export async function createLesson(data: {
  title: string;
  order: number;
  chapterId: string;
  isFree?: boolean;
  isPublished?: boolean;
  video?: { url?: string; provider?: string; durationSec?: number };
}) {
  return Lesson.create({
    title: data.title,
    order: data.order,
    chapterId: toObjectId(data.chapterId, "Chapter ID"),
    isFree: data.isFree ?? false,
    isPublished: data.isPublished ?? false,
    video: data.video?.url
      ? {
          url: data.video.url,
          provider: data.video.provider ?? "youtube",
          durationSec: data.video.durationSec ?? 0,
        }
      : undefined,
  });
}

export async function updateLesson(id: string, data: Record<string, unknown>) {
  if (typeof data.chapterId === "string") {
    data.chapterId = toObjectId(data.chapterId, "Chapter ID");
  }
  return Lesson.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteLesson(id: string) {
  return Lesson.findByIdAndDelete(id);
}

export async function getRevenue() {
  const transactions = await PaymentTransaction.aggregate([
    { $match: { status: "success" } },
    {
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
          day: { $dayOfMonth: "$paidAt" },
        },
        totalRevenue: { $sum: "$amountVnd" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  return transactions.map((t) => ({
    date: `${t._id.year}-${String(t._id.month).padStart(2, "0")}-${String(t._id.day).padStart(2, "0")}`,
    revenue: t.totalRevenue,
  }));
}
