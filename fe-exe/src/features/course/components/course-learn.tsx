import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Star, Share2, Play, BookOpen, Lock, Gamepad2 } from "lucide-react";
import {
  CourseBreadcrumb,
  CourseProgressCard,
  CourseOutcome,
} from "./shared";
import FlashCards from "./shared/flash-card";
import Mindmap from "./shared/mindmap";
import LessonQuiz from "./shared/lesson-quiz";
import { IMG } from "@/lib/images";
import { chapterApi } from "../api/course-api";
import { lessonApi } from "../api/lesson-api";
import { lessonProgressApi } from "../api/lesson-progress-api";
import { timelineApi } from "@/features/timeLine/api/timeline-api";
import { useChapterAccess } from "../hooks/useChapterAccess";
import {
  extractYoutubeVideoId,
  formatLessonDuration,
} from "../lib/lesson-utils";
import type { Chapter, Lesson, LessonDetail } from "../types";
import type { Timeline } from "@/features/timeLine/types";

type SidebarLesson = {
  id: string;
  name: string;
  type: "video" | "book";
  time?: string;
  isLocked?: boolean;
};

const CourseLearningPage = () => {
  const { slug: timelineSlug, chapterSlug } = useParams<{
    slug: string;
    chapterSlug: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonIdFromUrl = searchParams.get("lesson");
  const navigate = useNavigate();

  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [videoWatched, setVideoWatched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<{ destroy: () => void } | null>(null);

  const activeLesson = useMemo(
    () => lessons.find((l) => l._id === lessonIdFromUrl) ?? lessons[0] ?? null,
    [lessons, lessonIdFromUrl],
  );

  const sidebarLessons: SidebarLesson[] = useMemo(
    () =>
      lessons.map((lesson) => ({
        id: lesson._id,
        name: lesson.title,
        type: lesson.videos?.length ? "video" : "book",
        time: formatLessonDuration(lesson.videos?.[0]?.durationSec),
        isLocked: false,
      })),
    [lessons],
  );

  const completedCount = lessons.filter(
    (l) => l.progress?.status === "completed",
  ).length;
  const progressPct = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  const activeVideoId = useMemo(() => {
    const url = activeLesson?.videos?.[0]?.url;
    return url ? extractYoutubeVideoId(url) : null;
  }, [activeLesson]);

  const flashcardCards = useMemo(() => {
    const cards = lessonDetail?.flashcardSet?.cards ?? [];
    return cards.map((card) => ({
      front: card.front,
      back: card.back,
      year: card.front,
      content: card.back,
    }));
  }, [lessonDetail]);

  const { isAuthenticated, levelLocked } = useChapterAccess(
    chapter,
  );

  const refreshLessons = useCallback(async () => {
    if (!chapter) return;
    const list = await lessonApi.getLessonsByChapterId(chapter._id);
    setLessons(list.filter((l) => l.isPublished !== false));
  }, [chapter]);

  const handleQuizSubmit = useCallback(
    async (result: { score: number; passed: boolean; attempts: number }) => {
      if (!activeLesson?._id) return;

      const prevAttempts = lessonDetail?.progress?.quizAttempts ?? 0;
      const bestScore = Math.max(
        result.score,
        lessonDetail?.progress?.quizBestScore ?? 0,
      );
      const passed =
        result.passed || Boolean(lessonDetail?.progress?.quizPassed);

      await lessonProgressApi.upsert({
        lessonId: activeLesson._id,
        quizBestScore: bestScore,
        quizPassed: passed,
        quizAttempts: prevAttempts + result.attempts,
        status: passed ? "completed" : "unlocked",
        ...(passed ? { videoWatchedPct: 100 } : {}),
      });

      await refreshLessons();
      const detail = await lessonApi.getLessonDetail(activeLesson._id);
      setLessonDetail(detail);
    },
    [activeLesson?._id, lessonDetail?.progress, refreshLessons],
  );

  useEffect(() => {
    if (loading || !chapter) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (levelLocked) {
      navigate("/vip");
    }
  }, [loading, chapter, isAuthenticated, levelLocked, navigate]);

  const selectLesson = useCallback(
    (lesson: SidebarLesson) => {
      if (lesson.isLocked || !timelineSlug || !chapterSlug) return;
      setSearchParams({ lesson: lesson.id });
    },
    [chapterSlug, setSearchParams, timelineSlug],
  );

  useEffect(() => {
    if (!timelineSlug || !chapterSlug) return;

    setLoading(true);
    setError("");

    Promise.all([
      timelineApi.getTimelineBySlug(timelineSlug),
      chapterApi.getChapter(chapterSlug),
    ])
      .then(([timelineData, chapterData]) => {
        setTimeline(timelineData);
        setChapter(chapterData);
        return lessonApi.getLessonsByChapterId(chapterData._id);
      })
      .then((lessonList) => {
        const published = lessonList.filter((l) => l.isPublished !== false);
        setLessons(published);
      })
      .catch((err) => {
        console.error(err);
        setError("Không tải được nội dung bài học.");
      })
      .finally(() => setLoading(false));
  }, [timelineSlug, chapterSlug]);

  useEffect(() => {
    if (lessons.length === 0) return;

    const hasValidLesson =
      lessonIdFromUrl && lessons.some((l) => l._id === lessonIdFromUrl);

    if (hasValidLesson) return;

    const targetId = lessons[0]?._id;
    if (targetId) {
      setSearchParams({ lesson: targetId }, { replace: true });
    }
  }, [lessons, lessonIdFromUrl, setSearchParams]);

  useEffect(() => {
    if (!activeLesson?._id) {
      setLessonDetail(null);
      return;
    }

    setDetailLoading(true);
    setVideoWatched(false);

    lessonApi
      .getLessonDetail(activeLesson._id)
      .then(setLessonDetail)
      .catch((err) => {
        console.error(err);
        setLessonDetail(null);
      })
      .finally(() => setDetailLoading(false));
  }, [activeLesson?._id]);

  useEffect(() => {
    if (!activeVideoId) return;

    let playerInstance: { destroy: () => void } | null = null;

    const createPlayer = () => {
      if (!ytContainerRef.current) return;

      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          /* ignore */
        }
        ytPlayerRef.current = null;
      }

      ytContainerRef.current.innerHTML = "";
      const div = document.createElement("div");
      ytContainerRef.current.appendChild(div);

      playerInstance = new (window as any).YT.Player(div, {
        videoId: activeVideoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (event: { data: number }) => {
            if (event.data === 0) {
              setVideoWatched(true);
              if (activeLesson?._id) {
                lessonProgressApi
                  .upsert({
                    lessonId: activeLesson._id,
                    status: "completed",
                    videoWatchedPct: 100,
                  })
                  .then(() => refreshLessons())
                  .catch(console.error);
              }
            }
          },
        },
      });
      ytPlayerRef.current = playerInstance;
    };

    if ((window as any).YT?.Player) {
      createPlayer();
    } else {
      if (!document.getElementById("yt-iframe-api-script")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api-script";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
      const existing = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        existing?.();
        createPlayer();
      };
    }

    return () => {
      if (playerInstance) {
        try {
          playerInstance.destroy();
        } catch {
          /* ignore */
        }
      }
    };
  }, [activeVideoId]);

  const tabs = [
    { id: "Overview", label: "Tổng quan" },
    { id: "Quiz", label: "Quiz" },
    { id: "Review", label: "Ôn tập" },
    { id: "Mindmap", label: "Sơ đồ tư duy" },
  ];

  const quizPassed = Boolean(
    lessonDetail?.progress?.quizPassed ||
    activeLesson?.progress?.quizPassed ||
    activeLesson?.progress?.status === "completed",
  );
  const nextLessonLocked = sidebarLessons.find(
    (l, i) =>
      sidebarLessons[i - 1]?.id === activeLesson?._id && l.isLocked,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4a321f] text-white">
        Đang tải bài học...
      </div>
    );
  }

  if (error || !chapter || !timeline || !activeLesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FFF6F4] px-4">
        <p className="text-red-600">{error || "Không tìm thấy bài học."}</p>
        <button
          type="button"
          onClick={() =>
            navigate(
              timelineSlug && chapterSlug
                ? `/course/${timelineSlug}/chapter/${chapterSlug}`
                : "/course/all",
            )
          }
          className="rounded-xl bg-[#5c3a21] px-5 py-2 text-white text-sm font-bold"
        >
          Quay lại khóa học
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col font-sans">
      <div className="bg-[#4a321f] text-white px-8 py-3.5 flex items-center justify-between shadow-md relative z-20">
        <div className="flex items-center gap-8 min-w-0">
          <CourseBreadcrumb
            courseTitle={timeline.title}
            chapterTitle={chapter.title}
            timelineSlug={timelineSlug}
            className="text-sm"
          />
          <div className="hidden md:flex items-center gap-1.5 border-l border-white/10 pl-8">
            <div className="flex text-yellow-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm font-bold opacity-80">5.0</span>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 bg-transparent border border-white/20 px-5 py-2 rounded-md text-sm font-bold hover:bg-white/10 transition-all shrink-0"
        >
          Chia sẻ <Share2 size={16} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch bg-black">
        <div className="lg:w-[70%] aspect-video relative group overflow-hidden">
          {activeVideoId ? (
            <div className="w-full h-full bg-black">
              <div ref={ytContainerRef} className="w-full h-full" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a1a] text-white p-8">
              <BookOpen size={40} className="mb-4 text-white/60" />
              <h2 className="text-xl font-bold mb-3 text-center">
                {activeLesson.title}
              </h2>
              <p className="text-white/70 text-center max-w-xl leading-relaxed">
                {lessonDetail?.description ||
                  activeLesson.description ||
                  "Nội dung bài học."}
              </p>
            </div>
          )}
        </div>

        <div
          className="lg:w-[30%] min-h-[400px] lg:min-h-0 relative bg-cover"
          style={{ backgroundImage: `url(${IMG.paperTexture})` }}
        >
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-8">
            <div className="mb-8">
              <h2 className="text-[28px] font-title font-bold text-[#5c3a21] leading-tight mb-2">
                {chapter.title}
              </h2>
              <p className="text-[13px] text-gray-500 font-medium">
                {lessons.length} bài học • {progressPct}% hoàn thành
              </p>
            </div>

            <div className="space-y-2">
              {sidebarLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  disabled={lesson.isLocked}
                  onClick={() => selectLesson(lesson)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${lesson.id === activeLesson._id
                      ? "bg-[#5c3a21] text-white"
                      : lesson.isLocked
                        ? "opacity-50 cursor-not-allowed text-gray-500"
                        : "hover:bg-[#5c3a21]/10 text-[#5c3a21]"
                    }`}
                >
                  {lesson.isLocked ? (
                    <Lock size={16} />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                  <span className="text-sm font-medium flex-1">{lesson.name}</span>
                  {lesson.time && (
                    <span className="text-xs opacity-70">{lesson.time}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-[#FFF6F4] border-t border-black/5">
        <div className="border-b border-black/5">
          <div className="flex gap-8 px-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-6 text-[15px] font-bold transition-all relative ${activeTab === tab.id
                    ? "text-[#5c3a21]"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5c3a21]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === "Overview" && (
            <div className="flex flex-row items-start justify-between gap-8 px-8">
              <CourseOutcome
                title="Thông tin bài học"
                outcomes={
                  activeLesson.description
                    ? [activeLesson.description]
                    : [
                      videoWatched
                        ? "Video bài giảng đã xem xong."
                        : "Xem video bài giảng.",
                      "Làm Quiz ở tab Quiz — đạt điểm yêu cầu để hoàn thành bài và mở khóa bài sau.",
                      "Ôn tập flashcard ở các tab tương ứng.",
                    ]
                }
              />
              <CourseProgressCard
                progressPercentage={progressPct}
                variant="large"
              />
            </div>
          )}
          {activeTab === "Quiz" && (
            <div className="mx-auto mt-6 w-full max-w-4xl pb-10">
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#5c3a21]/10 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#5c3a21]">
                    Quiz bài học
                  </h3>
                  {quizPassed ? (
                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                      Bạn đã hoàn thành quiz này.
                    </p>
                  ) : nextLessonLocked ? (
                    <p className="mt-1 text-sm text-gray-500">
                      Hoàn thành quiz để mở khóa {nextLessonLocked.name}.
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Làm quiz hoặc chơi game để ôn tập kiến thức bài học.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/game/vuot-rao/${activeLesson._id}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5c3a21] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#4a2e1a]"
                >
                  <Gamepad2 size={16} />
                  Chơi game
                </button>
              </div>

              {detailLoading ? (
                <p className="py-12 text-center text-gray-500">
                  Đang tải quiz...
                </p>
              ) : lessonDetail?.quizData ? (
                <LessonQuiz
                  quiz={lessonDetail.quizData}
                  onSubmit={handleQuizSubmit}
                  previousBestScore={
                    lessonDetail.progress?.quizBestScore ??
                    activeLesson.progress?.quizBestScore ??
                    0
                  }
                  alreadyPassed={quizPassed}
                />
              ) : (
                <p className="py-12 text-center text-gray-500">
                  Chưa có quiz cho bài học này.
                </p>
              )}
            </div>
          )}
          {activeTab === "Review" && (
            <div className="mt-6 mx-[7%] flex flex-col items-center pb-10">
              <div className="w-full mb-4">
                <h3 className="text-2xl font-bold text-[#5c3a21]">
                  Ôn tập kiến thức
                </h3>
                {lessonDetail?.flashcardSet?.title && (
                  <p className="text-sm text-gray-500 mt-1">
                    {lessonDetail.flashcardSet.title}
                  </p>
                )}
              </div>
              {detailLoading ? (
                <p className="text-gray-500 py-12">Đang tải flashcard...</p>
              ) : flashcardCards.length > 0 ? (
                <FlashCards cards={flashcardCards} />
              ) : (
                <p className="text-gray-500 py-12">
                  Chưa có flashcard cho bài học này.
                </p>
              )}
            </div>
          )}

          {activeTab === "Mindmap" && (
            <div className="mt-6 mx-[7%] flex flex-col items-center pb-10 w-[86%]">
              {detailLoading ? (
                <p className="text-gray-500 py-12">Đang tải sơ đồ tư duy...</p>
              ) : lessonDetail?.mindmap ? (
                <Mindmap mindmap={lessonDetail.mindmap} />
              ) : (
                <p className="text-gray-500 py-12">
                  Chưa có sơ đồ tư duy cho bài học này.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;


