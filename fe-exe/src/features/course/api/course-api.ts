import { apiRequest } from "@/lib/api-client";
import type { Chapter } from "../types";

const TIMELINE_PREFIX = "/api/chapters";

export const chapterApi = {
  getChaptersByTimelineId(timelineId: string) {
    return apiRequest<Chapter[]>(`${TIMELINE_PREFIX}/timeline/${timelineId}`);
  },
  getAllChapters() {
    return apiRequest<Chapter[]>(`${TIMELINE_PREFIX}`);
  },
  getChaptersByClass(classNum: number) {
    return apiRequest<Chapter[]>(`${TIMELINE_PREFIX}?class=${classNum}`);
  },
  getChapter(slug: string) {
    return apiRequest<Chapter>(`${TIMELINE_PREFIX}/${slug}`);
  },
};
