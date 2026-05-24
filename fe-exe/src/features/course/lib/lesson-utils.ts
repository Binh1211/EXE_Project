export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace(/^\//, "") || null;
    }
    return parsed.searchParams.get("v");
  } catch {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/,
    );
    return match?.[1] ?? null;
  }
}

export function formatLessonDuration(durationSec?: number): string | undefined {
  if (!durationSec) return undefined;
  return `${Math.max(1, Math.round(durationSec / 60))} phút`;
}

export function buildLearnPath(
  timelineSlug: string,
  chapterSlug: string,
  lessonId: string,
) {
  return `/course/${timelineSlug}/chapter/${chapterSlug}/learn?lesson=${lessonId}`;
}
