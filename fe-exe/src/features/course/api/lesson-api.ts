import { apiRequest } from "@/lib/api-client";
import type { Lesson, LessonDetail } from "../types";

const LESSON_PREFIX = "/api/lessons";

export const lessonApi = {
  getLessonsByChapterId(chapterId: string) {
    return apiRequest<Lesson[]>(`${LESSON_PREFIX}?chapterId=${chapterId}`);
  },

  getLesson(id: string) {
    return apiRequest<Lesson>(`${LESSON_PREFIX}/${id}`);
  },

  getLessonDetail(id: string) {
    return apiRequest<LessonDetail>(`${LESSON_PREFIX}/${id}/detail`);
  },
};
