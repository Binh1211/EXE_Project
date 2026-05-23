import type { Request, Response } from "express";
import { z } from "zod";
import {
  createFaqItem,
  deleteFaqItem,
  getAllFaqItems,
  getFaqItemById,
  updateFaqItem,
} from "../services/faq.service.js";

const faqItemSchema = z.object({
  lessonId: z.string().min(1, "ID bài học không được để trống."),
  question: z.string().min(1, "Câu hỏi không được để trống."),
  answer: z.string().min(1, "Trả lời không được để trống."),
  order: z.number().int().min(0, "Thứ tự phải là số nguyên không âm."),
  isActive: z.boolean().optional(),
});

const faqItemUpdateSchema = faqItemSchema.partial();

export async function listFaqItems(req: Request, res: Response) {
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : undefined;
  const faqItems = await getAllFaqItems({ lessonId });
  res.json(faqItems);
}

export async function getFaqItem(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const faqItem = await getFaqItemById(id);
  res.json(faqItem);
}

export async function createFaqItemHandler(req: Request, res: Response) {
  const data = faqItemSchema.parse(req.body);
  const faqItem = await createFaqItem(data);
  res.status(201).json(faqItem);
}

export async function updateFaqItemHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = faqItemUpdateSchema.parse(req.body);
  const faqItem = await updateFaqItem(id, data);
  res.json(faqItem);
}

export async function deleteFaqItemHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteFaqItem(id);
  res.json(result);
}
