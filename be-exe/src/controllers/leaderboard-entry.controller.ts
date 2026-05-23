import type { Request, Response } from "express";
import { z } from "zod";
import { createEntry, deleteEntry, getEntryById, listEntries, updateEntry } from "../services/leaderboard-entry.service.js";

const createSchema = z.object({
  userId: z.string().min(1),
  groupId: z.string().optional(),
  period: z.string().optional(),
  rank: z.number().int().optional(),
  quizzesPassed: z.number().int().optional(),
  lessonsCompleted: z.number().int().optional(),
  groupSessionsWon: z.number().int().optional(),
});

const updateSchema = z.object({
  rank: z.number().int().optional(),
  quizzesPassed: z.number().int().optional(),
  lessonsCompleted: z.number().int().optional(),
  groupSessionsWon: z.number().int().optional(),
});

export async function listHandler(req: Request, res: Response) {
  const period = typeof req.query.period === "string" ? req.query.period : undefined;
  const groupId = typeof req.query.groupId === "string" ? req.query.groupId : undefined;
  const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
  const entries = await listEntries({ period, groupId, userId });
  res.json(entries);
}

export async function getHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const entry = await getEntryById(id);
  res.json(entry);
}

export async function createHandler(req: Request, res: Response) {
  const data = createSchema.parse(req.body);
  const entry = await createEntry(data);
  res.status(201).json(entry);
}

export async function updateHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = updateSchema.parse(req.body);
  const entry = await updateEntry(id, data);
  res.json(entry);
}

export async function deleteHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteEntry(id);
  res.json(result);
}
