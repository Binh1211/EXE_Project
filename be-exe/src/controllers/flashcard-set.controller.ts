import type { Request, Response } from "express";
import { z } from "zod";
import {
  createFlashcardSet,
  deleteFlashcardSet,
  getAllFlashcardSets,
  getFlashcardSetById,
  updateFlashcardSet,
} from "../services/flashcard-set.service.js";

const flashcardSchema = z.object({
  front: z.string().min(1, "Mặt trước không được để trống."),
  back: z.string().min(1, "Mặt sau không được để trống."),
  imageUrl: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

const flashcardSetSchema = z.object({
  lessonId: z.string().min(1, "ID bài học không được để trống."),
  title: z.string().min(1, "Tiêu đề không được để trống."),
  cards: z.array(flashcardSchema).optional(),
});

const flashcardSetUpdateSchema = flashcardSetSchema.partial();

export async function listFlashcardSets(req: Request, res: Response) {
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : undefined;
  const flashcardSets = await getAllFlashcardSets({ lessonId });
  res.json(flashcardSets);
}

export async function getFlashcardSet(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const flashcardSet = await getFlashcardSetById(id);
  res.json(flashcardSet);
}

export async function createFlashcardSetHandler(req: Request, res: Response) {
  const data = flashcardSetSchema.parse(req.body);
  const flashcardSet = await createFlashcardSet(data);
  res.status(201).json(flashcardSet);
}

export async function updateFlashcardSetHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = flashcardSetUpdateSchema.parse(req.body);
  const flashcardSet = await updateFlashcardSet(id, data);
  res.json(flashcardSet);
}

export async function deleteFlashcardSetHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteFlashcardSet(id);
  res.json(result);
}
