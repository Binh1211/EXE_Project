import mongoose from "mongoose";
import { Group, User } from "../models/index.js";

export class GroupError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new GroupError(400, "ID không hợp lệ.");
  }
}

export async function listGroups(filters: { ownerId?: string } = {}) {
  const query: Record<string, unknown> = {};
  if (filters.ownerId) {
    validateObjectId(filters.ownerId);
    query.ownerId = new mongoose.Types.ObjectId(filters.ownerId);
  }
  return await Group.find(query).sort({ createdAt: -1 });
}

export async function getGroupById(id: string) {
  validateObjectId(id);
  const group = await Group.findById(id);
  if (!group) throw new GroupError(404, "Nhóm không tồn tại.");
  return group;
}

export async function findGroupByInviteCode(code: string) {
  const g = await Group.findOne({ inviteCode: code });
  if (!g) throw new GroupError(404, "Không tìm thấy invite code.");
  return g;
}

export async function createGroup(input: {
  ownerId: string;
  name: string;
  description?: string;
  inviteCode?: string;
  maxMembers?: number;
  isPrivate?: boolean;
}) {
  validateObjectId(input.ownerId);
  const owner = await User.findById(input.ownerId);
  if (!owner) throw new GroupError(404, "Người dùng owner không tồn tại.");

  const payload: any = {
    ownerId: new mongoose.Types.ObjectId(input.ownerId),
    name: input.name.trim(),
    description: input.description,
    inviteCode: input.inviteCode ?? Math.random().toString(36).substring(2, 8).toUpperCase(),
    maxMembers: input.maxMembers ?? 50,
    isPrivate: input.isPrivate ?? true,
    members: [{ userId: new mongoose.Types.ObjectId(input.ownerId), role: "owner" }],
  };

  const created = await Group.create(payload);
  return created;
}

export async function updateGroup(
  id: string,
  updates: {
    name?: string;
    description?: string;
    maxMembers?: number;
    isPrivate?: boolean;
  },
) {
  validateObjectId(id);
  const group = await Group.findById(id);
  if (!group) throw new GroupError(404, "Nhóm không tồn tại.");

  if (updates.name !== undefined) group.name = updates.name.trim();
  if (updates.description !== undefined) group.description = updates.description;
  if (updates.maxMembers !== undefined) group.maxMembers = updates.maxMembers;
  if (updates.isPrivate !== undefined) group.isPrivate = updates.isPrivate;

  await group.save();
  return group;
}

export async function deleteGroup(id: string) {
  validateObjectId(id);
  const deleted = await Group.findByIdAndDelete(id);
  if (!deleted) throw new GroupError(404, "Nhóm không tồn tại.");
  return { message: "Nhóm đã được xóa." };
}

export async function addMember(groupId: string, userId: string, role: "owner" | "mod" | "member" = "member") {
  validateObjectId(groupId);
  validateObjectId(userId);
  const group = await Group.findById(groupId);
  if (!group) throw new GroupError(404, "Nhóm không tồn tại.");
  const user = await User.findById(userId);
  if (!user) throw new GroupError(404, "Người dùng không tồn tại.");

  const existing = group.members.find((m: any) => m.userId?.toString() === userId);
  if (existing) throw new GroupError(400, "Người dùng đã là thành viên.");

  if (group.members.length >= (group.maxMembers ?? 50)) {
    throw new GroupError(400, "Nhóm đã đạt giới hạn thành viên.");
  }

  group.members.push({ userId: new mongoose.Types.ObjectId(userId), role, joinedAt: new Date() });
  await group.save();
  return group;
}

export async function removeMember(groupId: string, userId: string) {
  validateObjectId(groupId);
  validateObjectId(userId);
  const group = await Group.findById(groupId);
  if (!group) throw new GroupError(404, "Nhóm không tồn tại.");

  const before = group.members.length;
  group.set(
    "members",
    group.members.filter((m: any) => m.userId?.toString() !== userId),
  );
  if (group.members.length === before) throw new GroupError(404, "Thành viên không tồn tại trong nhóm.");

  await group.save();
  return group;
}

export async function updateMemberRole(groupId: string, userId: string, role: "owner" | "mod" | "member") {
  validateObjectId(groupId);
  validateObjectId(userId);
  const group = await Group.findById(groupId);
  if (!group) throw new GroupError(404, "Nhóm không tồn tại.");

  const member = group.members.find((m: any) => m.userId?.toString() === userId);
  if (!member) throw new GroupError(404, "Thành viên không tồn tại trong nhóm.");

  member.role = role;
  await group.save();
  return group;
}
