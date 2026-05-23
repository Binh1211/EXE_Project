import mongoose from "mongoose";
import { FaqItem, Lesson } from "../models/index.js";

export class FaqItemError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new FaqItemError(400, "ID không hợp lệ.");
  }
}

async function ensureLessonExists(lessonId: string) {
  validateObjectId(lessonId);
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new FaqItemError(404, "Bài học không tồn tại.");
  }
}

export async function getAllFaqItems(filters: { lessonId?: string } = {}) {
  const query: Record<string, unknown> = {};

  if (filters.lessonId) {
    validateObjectId(filters.lessonId);
    query.lessonId = new mongoose.Types.ObjectId(filters.lessonId);
  }

  return await FaqItem.find(query).sort({ order: 1, createdAt: -1 });
}

export async function getFaqItemById(id: string) {
  validateObjectId(id);
  const faqItem = await FaqItem.findById(id);
  if (!faqItem) {
    throw new FaqItemError(404, "Không tìm thấy FAQ.");
  }
  return faqItem;
}

export async function createFaqItem(input: {
  lessonId: string;
  question: string;
  answer: string;
  order: number;
  isActive?: boolean;
}) {
  await ensureLessonExists(input.lessonId);

  return await FaqItem.create({
    lessonId: new mongoose.Types.ObjectId(input.lessonId),
    question: input.question.trim(),
    answer: input.answer.trim(),
    order: input.order,
    isActive: input.isActive ?? true,
  });
}

export async function updateFaqItem(
  id: string,
  updates: {
    lessonId?: string;
    question?: string;
    answer?: string;
    order?: number;
    isActive?: boolean;
  },
) {
  validateObjectId(id);

  const faqItem = await FaqItem.findById(id);
  if (!faqItem) {
    throw new FaqItemError(404, "Không tìm thấy FAQ.");
  }

  if (updates.lessonId) {
    await ensureLessonExists(updates.lessonId);
    faqItem.lessonId = new mongoose.Types.ObjectId(updates.lessonId);
  }
  if (updates.question !== undefined) {
    faqItem.question = updates.question.trim();
  }
  if (updates.answer !== undefined) {
    faqItem.answer = updates.answer.trim();
  }
  if (updates.order !== undefined) {
    faqItem.order = updates.order;
  }
  if (updates.isActive !== undefined) {
    faqItem.isActive = updates.isActive;
  }

  await faqItem.save();
  return faqItem;
}

export async function deleteFaqItem(id: string) {
  validateObjectId(id);

  const faqItem = await FaqItem.findByIdAndDelete(id);
  if (!faqItem) {
    throw new FaqItemError(404, "Không tìm thấy FAQ.");
  }

  return { message: "FAQ đã được xóa thành công." };
}
