import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  getStoredUser,
  isAuthenticated as hasAuthToken,
} from "@/features/auth/lib/auth-session";
import type { Chapter } from "../types";

/** Hai chapter đầu (index 0, 1) mở cho level 1; từ chapter thứ 3 trở đi cần level 2+ */
export function getEffectiveRequiredLevel(chapterIndex: number): 1 | 2 {
  return chapterIndex < 2 ? 1 : 2;
}

export function getUserLevel(user: { level?: number } | null | undefined) {
  return user?.level ?? 1;
}

export function isChapterLevelLocked(
  chapterIndex: number,
  userLevel: number,
): boolean {
  return userLevel < getEffectiveRequiredLevel(chapterIndex);
}

export function useChapterAccess(
  chapter: Chapter | null,
  chapterIndex: number | null = null,
) {
  const { user, isLoggedIn } = useAuthUser();
  const stored = getStoredUser();
  const isAuthenticated = isLoggedIn || hasAuthToken();
  const userLevel = getUserLevel(user ?? stored);

  const index =
    chapterIndex !== null && chapterIndex >= 0
      ? chapterIndex
      : null;

  const requiredLevel =
    index !== null ? getEffectiveRequiredLevel(index) : (chapter?.requiredLevel ?? 1);

  const levelLocked =
    index !== null
      ? isChapterLevelLocked(index, userLevel)
      : userLevel < (chapter?.requiredLevel ?? 1);

  return {
    user: user ?? stored,
    isAuthenticated,
    userLevel,
    levelLocked,
    requiredLevel,
    chapterIndex: index,
  };
}
