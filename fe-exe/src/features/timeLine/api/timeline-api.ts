import { apiRequest } from "@/lib/api-client";
import type { Timeline } from "../types";

const TIMELINE_PREFIX = "/api/timeline";

export const timelineApi = {
  getTimelines() {
    return apiRequest<Timeline[]>(TIMELINE_PREFIX);
  },
  
  getTimeline(slug: string) {
    return apiRequest<Timeline>(`${TIMELINE_PREFIX}/${slug}`);
  }
};
