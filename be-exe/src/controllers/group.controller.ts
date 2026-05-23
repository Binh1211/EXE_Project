import type { Request, Response } from "express";
import { z } from "zod";
import {
  addMember,
  createGroup,
  deleteGroup,
  findGroupByInviteCode,
  getGroupById,
  listGroups,
  removeMember,
  updateGroup,
  updateMemberRole,
} from "../services/group.service.js";

const createSchema = z.object({
  ownerId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  inviteCode: z.string().optional(),
  maxMembers: z.number().int().min(1).optional(),
  isPrivate: z.boolean().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  maxMembers: z.number().int().min(1).optional(),
  isPrivate: z.boolean().optional(),
});

const memberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["owner", "mod", "member"]).optional(),
});

const memberRoleSchema = z.object({ role: z.enum(["owner", "mod", "member"]) });

export async function listAll(req: Request, res: Response) {
  const ownerId = typeof req.query.ownerId === "string" ? req.query.ownerId : undefined;
  const list = await listGroups({ ownerId });
  res.json(list);
}

export async function getGroup(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const group = await getGroupById(id);
  res.json(group);
}

export async function getByInvite(req: Request, res: Response) {
  const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
  const group = await findGroupByInviteCode(code);
  res.json(group);
}

export async function createGroupHandler(req: Request, res: Response) {
  const data = createSchema.parse(req.body);
  const group = await createGroup(data);
  res.status(201).json(group);
}

export async function updateGroupHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = updateSchema.parse(req.body);
  const group = await updateGroup(id, data);
  res.json(group);
}

export async function deleteGroupHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteGroup(id);
  res.json(result);
}

export async function addMemberHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = memberSchema.parse(req.body);
  const group = await addMember(id, data.userId, (data.role as any) ?? "member");
  res.json(group);
}

export async function updateMemberRoleHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const data = memberRoleSchema.parse(req.body);
  const group = await updateMemberRole(id, userId, data.role);
  res.json(group);
}

export async function removeMemberHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const group = await removeMember(id, userId);
  res.json(group);
}
