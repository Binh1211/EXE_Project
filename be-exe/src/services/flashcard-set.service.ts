import mongoose from "mongoose";
import { FlashcardSet, Lesson } from "../models/index.js";

export class FlashcardSetError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new FlashcardSetError(400, "ID không hợp lệ.");
  }
}

async function ensureLessonExists(lessonId: string) {
  validateObjectId(lessonId);
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new FlashcardSetError(404, "Bài học không tồn tại.");
  }
}

export async function getAllFlashcardSets(filters: { lessonId?: string } = {}) {
  const query: Record<string, unknown> = {};

  if (filters.lessonId) {
    validateObjectId(filters.lessonId);
    query.lessonId = new mongoose.Types.ObjectId(filters.lessonId);
  }

  return await FlashcardSet.find(query).sort({ createdAt: -1 });
}

export async function getFlashcardSetById(id: string) {
  validateObjectId(id);

  const flashcardSet = await FlashcardSet.findById(id);
  if (!flashcardSet) {
    throw new FlashcardSetError(404, "Không tìm thấy flashcard set.");
  }

  return flashcardSet;
}

export async function createFlashcardSet(input: {
  lessonId: string;
  title: string;
  cards?: Array<{
    front: string;
    back: string;
    imageUrl?: string;
    order?: number;
  }>;
}) {
  await ensureLessonExists(input.lessonId);

  return await FlashcardSet.create({
    lessonId: new mongoose.Types.ObjectId(input.lessonId),
    title: input.title.trim(),
    cards: input.cards?.map((card) => ({
      front: card.front.trim(),
      back: card.back.trim(),
      imageUrl: card.imageUrl?.trim() || "",
      order: card.order ?? 0,
    })) ?? [],
  });
}

export async function updateFlashcardSet(
  id: string,
  updates: {
    lessonId?: string;
    title?: string;
    cards?: Array<{
      front: string;
      back: string;
      imageUrl?: string;
      order?: number;
    }>;
  },
) {
  validateObjectId(id);

  const flashcardSet = await FlashcardSet.findById(id);
  if (!flashcardSet) {
    throw new FlashcardSetError(404, "Không tìm thấy flashcard set.");
  }

  if (updates.lessonId) {
    await ensureLessonExists(updates.lessonId);
    flashcardSet.lessonId = new mongoose.Types.ObjectId(updates.lessonId);
  }
  if (updates.title !== undefined) {
    flashcardSet.title = updates.title.trim();
  }
  if (updates.cards !== undefined) {
    flashcardSet.set(
      "cards",
      updates.cards.map((card) => ({
        front: card.front.trim(),
        back: card.back.trim(),
        imageUrl: card.imageUrl?.trim() || "",
        order: card.order ?? 0,
      })),
    );
  }

  await flashcardSet.save();
  return flashcardSet;
}

export async function deleteFlashcardSet(id: string) {
  validateObjectId(id);

  const flashcardSet = await FlashcardSet.findByIdAndDelete(id);
  if (!flashcardSet) {
    throw new FlashcardSetError(404, "Không tìm thấy flashcard set.");
  }

  return { message: "Flashcard set đã được xóa thành công." };
}
