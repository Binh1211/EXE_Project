import { apiRequest } from "@/lib/api-client";
import type { LessonQuizDocument } from "../types";

const QUIZ_PREFIX = "/api/quizzes";

export const quizApi = {
  getAllQuizzes() {
    return apiRequest<LessonQuizDocument[]>(QUIZ_PREFIX);
  },

  getQuizzesByLessonId(lessonId: string) {
    return apiRequest<LessonQuizDocument[]>(`${QUIZ_PREFIX}?lessonId=${lessonId}`);
  },
};
