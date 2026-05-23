import type { Request, Response } from "express";
import { z } from "zod";
import {
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizzesByLesson,
  updateQuiz,
} from "../services/quiz.service.js";

const optionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1),
});

const questionSchema = z.object({
  questionId: z.string().optional(),
  type: z.enum(["mc", "truefalse"]),
  text: z.string().min(1),
  imageUrl: z.string().optional(),
  options: z.array(optionSchema).optional(),
  correctOptionId: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().int().min(0).optional(),
});

const quizSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(1),
  passingScore: z.number().int().min(0).max(100).optional(),
  timeLimitSec: z.number().int().min(0).optional(),
  questions: z.array(questionSchema).optional(),
});

const quizUpdateSchema = quizSchema.partial();

export async function listQuizzes(req: Request, res: Response) {
  const lessonId = typeof req.query.lessonId === "string" ? req.query.lessonId : undefined;
  const quizzes = await getAllQuizzes({ lessonId });
  res.json(quizzes);
}

export async function listQuizzesByLesson(req: Request, res: Response) {
  const lessonId = Array.isArray(req.params.lessonId) ? req.params.lessonId[0] : req.params.lessonId;
  const quizzes = await getQuizzesByLesson(lessonId);
  res.json(quizzes);
}

export async function getQuiz(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const quiz = await getQuizById(id);
  res.json(quiz);
}

export async function createQuizHandler(req: Request, res: Response) {
  const data = quizSchema.parse(req.body);
  const quiz = await createQuiz(data);
  res.status(201).json(quiz);
}

export async function updateQuizHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = quizUpdateSchema.parse(req.body);
  const quiz = await updateQuiz(id, data);
  res.json(quiz);
}

export async function deleteQuizHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteQuiz(id);
  res.json(result);
}
