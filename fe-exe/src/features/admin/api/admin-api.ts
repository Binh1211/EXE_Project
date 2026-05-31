import { apiRequest, getApiErrorMessage } from "../../../lib/api-client";
import type { AuthUser } from "../../auth/types";

export type AdminUser = AuthUser & {
  _id: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
};

export type AdminTimeline = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl: string;
  displayTime: string;
};

export type AdminChapter = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  requiredLevel: number;
  coverImageUrl?: string;
  timelineId: string;
  isPublished?: boolean;
};

export type AdminLesson = {
  _id: string;
  title: string;
  order: number;
  chapterId: string;
  isFree: boolean;
  isPublished: boolean;
  video?: { url?: string; provider?: string; durationSec?: number };
};

export type RevenueData = { date: string; revenue: number };

export { getApiErrorMessage };

export const adminApi = {
  getTimelines: () => apiRequest<AdminTimeline[]>("/api/admin/timelines"),

  createTimeline: (payload: Omit<AdminTimeline, "_id">) =>
    apiRequest<AdminTimeline>("/api/admin/timelines", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateTimeline: (id: string, payload: Partial<AdminTimeline>) =>
    apiRequest<AdminTimeline>(`/api/admin/timelines/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteTimeline: (id: string) =>
    apiRequest<void>(`/api/admin/timelines/${id}`, { method: "DELETE" }),

  getUsers: () => apiRequest<AdminUser[]>("/api/admin/users"),

  updateUser: (id: string, payload: Partial<AdminUser>) =>
    apiRequest<AdminUser>(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getChapters: (timelineId?: string) => {
    const url = timelineId
      ? `/api/admin/chapters?timelineId=${timelineId}`
      : "/api/admin/chapters";
    return apiRequest<AdminChapter[]>(url);
  },

  createChapter: (payload: Omit<AdminChapter, "_id">) =>
    apiRequest<AdminChapter>("/api/admin/chapters", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateChapter: (id: string, payload: Partial<AdminChapter>) =>
    apiRequest<AdminChapter>(`/api/admin/chapters/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteChapter: (id: string) =>
    apiRequest<void>(`/api/admin/chapters/${id}`, { method: "DELETE" }),

  getLessons: (chapterId?: string) => {
    const url = chapterId
      ? `/api/admin/lessons?chapterId=${chapterId}`
      : "/api/admin/lessons";
    return apiRequest<AdminLesson[]>(url);
  },

  createLesson: (payload: Omit<AdminLesson, "_id">) =>
    apiRequest<AdminLesson>("/api/admin/lessons", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateLesson: (id: string, payload: Partial<AdminLesson>) =>
    apiRequest<AdminLesson>(`/api/admin/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteLesson: (id: string) =>
    apiRequest<void>(`/api/admin/lessons/${id}`, { method: "DELETE" }),

  getRevenue: () => apiRequest<RevenueData[]>("/api/admin/revenue"),
};
