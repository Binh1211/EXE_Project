import { apiRequest } from "@/lib/api-client";
import type { LessonProgress } from "../types";

const PREFIX = "/api/lesson-progress";

export const lessonProgressApi = {
  upsert(payload: {
    lessonId: string;
    status?: "locked" | "unlocked" | "completed";
    videoWatchedPct?: number;
    flashcardsViewed?: boolean;
    quizBestScore?: number;
    quizPassed?: boolean;
    quizAttempts?: number;
  }) {
    return apiRequest<LessonProgress>(PREFIX, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
