import type { Request, Response } from "express";
import { z } from "zod";
import {
  createQuizAttempt,
  deleteQuizAttempt,
  getQuizAttemptById,
  listQuizAttempts,
  updateQuizAttempt,
} from "../services/quiz-attempt.service.js";

const answerSchema = z.object({
  questionId: z.string(),
  selectedOption: z.string().optional(),
  isCorrect: z.boolean().optional(),
});

const createSchema = z.object({
  userId: z.string().min(1),
  quizId: z.string().min(1),
  lessonId: z.string().min(1),
  score: z.number().optional(),
  timeTakenSec: z.number().optional(),
  answers: z.array(answerSchema).optional(),
});

const updateSchema = z.object({
  score: z.number().optional(),
  passed: z.boolean().optional(),
  timeTakenSec: z.number().optional(),
  answers: z.array(answerSchema).optional(),
  xpAwarded: z.number().optional(),
});

export async function listAttempts(req: Request, res: Response) {
  const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
  const quizId = typeof req.query.quizId === "string" ? req.query.quizId : undefined;
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : undefined;
  const attempts = await listQuizAttempts({ userId, quizId, lessonId });
  res.json(attempts);
}

export async function getAttempt(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const attempt = await getQuizAttemptById(id);
  res.json(attempt);
}

export async function createAttemptHandler(req: Request, res: Response) {
  const data = createSchema.parse(req.body);
  const attempt = await createQuizAttempt(data);
  res.status(201).json(attempt);
}

export async function updateAttemptHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = updateSchema.parse(req.body);
  const attempt = await updateQuizAttempt(id, data);
  res.json(attempt);
}

export async function deleteAttemptHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteQuizAttempt(id);
  res.json(result);
}
