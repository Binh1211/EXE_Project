import mongoose from "mongoose";
import { Chapter } from "../models/Chapter.js";

export class ChapterError extends Error {
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

  while (await Chapter.findOne({ slug: candidate, ...baseQuery })) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ChapterError(400, "ID chương không hợp lệ.");
  }
}

export async function getAllChapters() {
  return await Chapter.find().sort({ order: 1, createdAt: -1 });
}

export async function getChapterBySlug(slug: string) {
  const chapter = await Chapter.findOne({ slug });
  if (!chapter) {
    throw new ChapterError(404, "Không tìm thấy chương.");
  }
  return chapter;
}

export async function getChapterById(id: string) {
  validateObjectId(id);
  const chapter = await Chapter.findById(id);
  if (!chapter) {
    throw new ChapterError(404, "Không tìm thấy chương.");
  }
  return chapter;
}

export async function createChapter(input: {
  title: string;
  description?: string;
  coverImageUrl?: string;
  order: number;
  requiredLevel?: 1 | 2 | 3;
  isPublished?: boolean;
  slug?: string;
}) {
  const slugValue = normalizeSlug(input.slug || input.title);
  const uniqueSlug = await ensureSlugIsUnique(slugValue);

  const chapter = await Chapter.create({
    title: input.title.trim(),
    description: input.description?.trim() || "",
    coverImageUrl: input.coverImageUrl?.trim() || "",
    order: input.order,
    requiredLevel: input.requiredLevel ?? 1,
    isPublished: input.isPublished ?? false,
    slug: uniqueSlug,
  });

  return chapter;
}

export async function updateChapter(
  id: string,
  updates: {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    order?: number;
    requiredLevel?: 1 | 2 | 3;
    isPublished?: boolean;
    slug?: string;
  },
) {
  validateObjectId(id);

  const chapter = await Chapter.findById(id);
  if (!chapter) {
    throw new ChapterError(404, "Không tìm thấy chương.");
  }

  if (updates.slug) {
    const normalizedSlug = normalizeSlug(updates.slug);
    chapter.slug = await ensureSlugIsUnique(normalizedSlug, id);
  }

  if (updates.title !== undefined) {
    chapter.title = updates.title.trim();
  }
  if (updates.description !== undefined) {
    chapter.description = updates.description.trim();
  }
  if (updates.coverImageUrl !== undefined) {
    chapter.coverImageUrl = updates.coverImageUrl.trim();
  }
  if (updates.order !== undefined) {
    chapter.order = updates.order;
  }
  if (updates.requiredLevel !== undefined) {
    chapter.requiredLevel = updates.requiredLevel;
  }
  if (updates.isPublished !== undefined) {
    chapter.isPublished = updates.isPublished;
  }

  await chapter.save();
  return chapter;
}

export async function deleteChapter(id: string) {
  validateObjectId(id);

  const chapter = await Chapter.findById(id);
  if (!chapter) {
    throw new ChapterError(404, "Không tìm thấy chương.");
  }

  await chapter.deleteOne();
  return { message: "Chương đã được xóa thành công." };
}
