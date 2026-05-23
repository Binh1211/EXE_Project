import type { Request, Response } from "express";
import { z } from "zod";
import {
  addParticipant,
  createSession,
  deleteSession,
  endSession,
  getSessionById,
  listSessions,
  removeParticipant,
  startSession,
  updateSession,
} from "../services/group-game-session.service.js";

const createSchema = z.object({
  groupId: z.string().min(1),
  quizId: z.string().min(1),
  hostId: z.string().min(1),
  joinCode: z.string().optional(),
  xpMultiplier: z.number().optional(),
});

const updateSchema = z.object({
  status: z.union([z.literal("waiting"), z.literal("active"), z.literal("ended")]).optional(),
  xpMultiplier: z.number().optional(),
});

const participantSchema = z.object({ userId: z.string().min(1) });

export async function listAllSessions(req: Request, res: Response) {
  const groupId = typeof req.query.groupId === "string" ? req.query.groupId : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const sessions = await listSessions({ groupId, status });
  res.json(sessions);
}

export async function getSession(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const session = await getSessionById(id);
  res.json(session);
}

export async function createSessionHandler(req: Request, res: Response) {
  const data = createSchema.parse(req.body);
  const session = await createSession(data);
  res.status(201).json(session);
}

export async function updateSessionHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = updateSchema.parse(req.body);
  const session = await updateSession(id, data as any);
  res.json(session);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteSession(id);
  res.json(result);
}

export async function startSessionHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const session = await startSession(id);
  res.json(session);
}

export async function endSessionHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const session = await endSession(id);
  res.json(session);
}

export async function addParticipantHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = participantSchema.parse(req.body);
  const session = await addParticipant(id, data.userId);
  res.json(session);
}

export async function removeParticipantHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const session = await removeParticipant(id, userId);
  res.json(session);
}
