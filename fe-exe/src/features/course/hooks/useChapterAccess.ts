import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  getStoredUser,
  isAuthenticated as hasAuthToken,
} from "@/features/auth/lib/auth-session";
import type { Chapter } from "../types";

export function getUserLevel(user: { level?: number } | null | undefined) {
  return user?.level ?? 1;
}

export function isChapterLevelLocked(chapter: Chapter | null, userLevel: number): boolean {
  return userLevel < (chapter?.requiredLevel ?? 1);
}

export function useChapterAccess(chapter: Chapter | null) {
  const { user, isLoggedIn } = useAuthUser();
  const stored = getStoredUser();
  const isAuthenticated = isLoggedIn || hasAuthToken();
  const userLevel = getUserLevel(user ?? stored);
  const requiredLevel = chapter?.requiredLevel ?? 1;
  const levelLocked = isChapterLevelLocked(chapter, userLevel);

  return {
    user: user ?? stored,
    isAuthenticated,
    userLevel,
    levelLocked,
    requiredLevel,
  };
}
