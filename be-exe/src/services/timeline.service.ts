import mongoose from "mongoose";
import { Timeline } from "../models/Timeline.js";

export class TimelineError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureSlugIsUnique(slug: string, excludeId?: string) {
  let candidate = slug;
  let suffix = 1;
  const baseQuery = excludeId ? { _id: { $ne: excludeId } } : {};

  while (await Timeline.findOne({ slug: candidate, ...baseQuery })) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new TimelineError(400, "ID timeline không hợp lệ.");
  }
}

export async function getAllTimelines() {
  return await Timeline.find().sort({ order: 1 });
}

export async function getTimelineBySlug(slug: string) {
  const timeline = await Timeline.findOne({ slug });
  if (!timeline) {
    throw new TimelineError(404, "Không tìm thấy timeline.");
  }
  return timeline;
}

export async function createTimeline(input: {
  title: string;
  description?: string;
  imageUrl: string;
  displayTime: string;
  slug?: string;
  order: number;
  chapters?: string[];
}) {
  const slugValue = normalizeSlug(input.slug ?? input.title);
  const uniqueSlug = await ensureSlugIsUnique(slugValue);

  const timeline = await Timeline.create({
    title: input.title.trim(),
    description: input.description?.trim() || "",
    imageUrl: input.imageUrl.trim(),
    displayTime: input.displayTime.trim(),
    slug: uniqueSlug,
    order: input.order,
    chapters: input.chapters || [],
  });

  return timeline;
}

export async function updateTimeline(
  id: string,
  updates: {
    title?: string;
    description?: string;
    imageUrl?: string;
    displayTime?: string;
    slug?: string;
    order?: number;
    chapters?: string[];
  },
) {
  validateObjectId(id);

  const timeline = await Timeline.findById(id);
  if (!timeline) {
    throw new TimelineError(404, "Không tìm thấy timeline.");
  }

  if (updates.slug) {
    const normalizedSlug = normalizeSlug(updates.slug);
    timeline.slug = await ensureSlugIsUnique(normalizedSlug, id);
  }

  if (updates.title !== undefined) {
    timeline.title = updates.title.trim();
  }
  if (updates.description !== undefined) {
    timeline.description = updates.description.trim();
  }
  if (updates.imageUrl !== undefined) {
    timeline.imageUrl = updates.imageUrl.trim();
  }
  if (updates.displayTime !== undefined) {
    timeline.displayTime = updates.displayTime.trim();
  }
  if (updates.order !== undefined) {
    timeline.order = updates.order;
  }
  if (updates.chapters !== undefined) {
    timeline.chapters = updates.chapters as any[];
  }

  await timeline.save();
  return timeline;
}

export async function deleteTimeline(id: string) {
  validateObjectId(id);

  const timeline = await Timeline.findById(id);
  if (!timeline) {
    throw new TimelineError(404, "Không tìm thấy timeline.");
  }

  await timeline.deleteOne();
  return { message: "Timeline đã được xóa thành công." };
}
