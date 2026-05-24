import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Star,
  FileText,
  Video,
  Globe,
  Monitor,
  Calendar,
  PlayCircle,
  Play,
  Lock,
  BookOpen,
} from "lucide-react";
import {
  CourseBreadcrumb,
  RelatedCourseCard,
  CourseProgressCard,
} from "./shared";
import { IMG, resolveImageUrl } from "@/lib/images";
import { chapterApi } from "../api/course-api";
import { lessonApi } from "../api/lesson-api";
import { timelineApi } from "@/features/timeLine/api/timeline-api";
import {
  buildLearnPath,
  formatLessonDuration,
} from "../lib/lesson-utils";
import type { Chapter, Lesson } from "../types";
import type { Timeline } from "@/features/timeLine/types";
import { useChapterAccess } from "../hooks/useChapterAccess";

const CourseDetailPage = () => {
  const { slug: timelineSlug, chapterSlug } = useParams<{
    slug: string;
    chapterSlug: string;
  }>();
  const navigate = useNavigate();

  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapterIndex, setChapterIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, levelLocked } = useChapterAccess(
    chapter,
    chapterIndex,
  );

  useEffect(() => {
    if (loading || !chapter || chapterIndex === null) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (levelLocked) {
      navigate("/vip");
    }
  }, [loading, chapter, chapterIndex, isAuthenticated, levelLocked, navigate]);

  useEffect(() => {
    if (!timelineSlug || !chapterSlug) return;

    setLoading(true);
    setError("");

    Promise.all([
      timelineApi.getTimelineBySlug(timelineSlug),
      chapterApi.getChapter(chapterSlug),
    ])
      .then(async ([timelineData, chapterData]) => {
        setTimeline(timelineData);
        setChapter(chapterData);
        const allChapters = await chapterApi.getChaptersByTimelineId(
          timelineData._id,
        );
        const idx = allChapters.findIndex((ch) => ch._id === chapterData._id);
        setChapterIndex(idx >= 0 ? idx : 0);
        return lessonApi.getLessonsByChapterId(chapterData._id);
      })
      .then(setLessons)
      .catch((err) => {
        console.error(err);
        setError("Không tải được nội dung khóa học. Vui lòng thử lại.");
      })
      .finally(() => setLoading(false));
  }, [timelineSlug, chapterSlug]);

  const publishedLessons = lessons.filter((l) => l.isPublished !== false);
  const videoCount = publishedLessons.filter((l) => l.videos?.length).length;
  const completedCount = publishedLessons.filter(
    (l) => l.progress?.status === "completed",
  ).length;
  const progressPct = publishedLessons.length
    ? Math.round((completedCount / publishedLessons.length) * 100)
    : 0;

  const firstUnlocked = publishedLessons.find((l) => !l.isLocked);

  const goToLesson = (lesson: Lesson) => {
    if (levelLocked || lesson.isLocked || !timelineSlug || !chapterSlug) return;
    navigate(buildLearnPath(timelineSlug, chapterSlug, lesson._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF6F4]">
        <p className="text-[#5c3a21] font-medium">Đang tải khóa học...</p>
      </div>
    );
  }

  if (error || !chapter || !timeline) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FFF6F4] px-4">
        <p className="text-red-600">{error || "Không tìm thấy khóa học."}</p>
        <button
          type="button"
          onClick={() => navigate("/course")}
          className="rounded-xl bg-[#5c3a21] px-5 py-2 text-white text-sm font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const coverImage = resolveImageUrl(chapter.coverImageUrl) || IMG.news1;

  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover"
        style={{ backgroundImage: `url(${IMG.paperTexture})` }}
      />

      <div className="relative z-10">
        {/* Hero */}
        <div className="bg-[#5c3a21] text-white pt-5 pb-16 px-10 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
            }}
          />

          <div className="max-w-[1280px] mx-auto relative z-10">
            <CourseBreadcrumb
              courseTitle={timeline.title}
              chapterTitle={chapter.title}
              timelineSlug={timelineSlug}
              className="mb-4"
            />

            <div className="grid grid-cols-12 gap-12 items-center">
              <div className="col-span-12 lg:col-span-7">
                <h1 className="text-[44px] leading-[1.2] font-title font-bold mb-8 italic">
                  {chapter.title}
                </h1>

                <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
                  {chapter.description ||
                    "Khám phá nội dung bài học qua video, flashcard và FAQ bot."}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold">5.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-white/60" />
                    <span>{publishedLessons.length} bài học</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Video size={18} className="text-white/60" />
                    <span>{videoCount} video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-white/60" />
                    <span>{publishedLessons.length} tài liệu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-white/60" />
                    <span>Ngôn ngữ: Tiếng Việt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Monitor size={18} className="text-white/60" />
                    <span>Học online 100%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-white/60" />
                    <span>Tự học theo tiến độ</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 relative mt-8 lg:mt-0 pr-4">
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-black/40 aspect-[4/3]">
                  <img
                    src={coverImage}
                    alt={chapter.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {firstUnlocked && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                    <button
                      type="button"
                      onClick={() => goToLesson(firstUnlocked)}
                      className="w-24 h-24 rounded-full bg-[#fdf2e9] shadow-2xl flex items-center justify-center text-[#5c3a21] border-8 border-[#5c3a21] hover:scale-110 transition-transform cursor-pointer group"
                    >
                      <Play
                        size={32}
                        fill="currentColor"
                        className="ml-1.5 group-hover:scale-110 transition-transform"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="w-full px-8 md:px-12 pt-14 pb-16">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-[42px] font-serif font-bold text-gray-800 mb-4 italic">
                  Nội dung bài học
                </h2>
                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-[0.3em]">
                  {publishedLessons.length} bài • {videoCount} video
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {publishedLessons.map((lesson) => {
                const duration = formatLessonDuration(
                  lesson.videos?.[0]?.durationSec,
                );
                const locked = Boolean(lesson.isLocked);

                return (
                  <div
                    key={lesson._id}
                    onClick={() => goToLesson(lesson)}
                    className={`group flex items-center justify-between p-5 md:p-6 rounded-2xl border transition-all ${
                      locked
                        ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                        : "border-[#5c3a21]/10 bg-white hover:border-[#5c3a21]/30 hover:shadow-lg cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          locked ? "bg-gray-200" : "bg-[#5c3a21]/10"
                        }`}
                      >
                        {locked ? (
                          <Lock size={20} className="text-gray-500" />
                        ) : (
                          <PlayCircle size={22} className="text-[#5c3a21]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`font-medium text-lg truncate ${
                            locked
                              ? "text-gray-500"
                              : "text-[#5c3a21] group-hover:underline"
                          }`}
                        >
                          {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          {duration && <span>{duration}</span>}
                          {lesson.progress?.status === "completed" && (
                            <span className="text-emerald-600 font-semibold">
                              Đã hoàn thành
                            </span>
                          )}
                          {locked && (
                            <span className="text-amber-700 font-semibold">
                              Hoàn thành bài trước + quiz
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
              <CourseProgressCard
                progressPercentage={progressPct}
                variant="large"
              />
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="pt-8 pb-16">
          <div className="max-w-[1280px] mx-auto px-10">
            <div className="mb-6">
              <h2 className="text-[40px] font-serif font-bold text-[#5c3a21] mb-2 italic">
                Khóa học liên quan
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <RelatedCourseCard
                image={IMG.news1}
                title="Lịch Sử Việt Nam Qua Các Thời Kỳ"
                rating="5.0"
                description="Tìm hiểu hành trình phát triển của Việt Nam từ thời kỳ dựng nước."
              />
              <RelatedCourseCard
                image={IMG.news2}
                title="Nghìn năm Bắc thuộc & kháng chiến"
                rating="5.0"
                description="Các cuộc khởi nghĩa và tinh thần bất khuất của dân tộc."
              />
              <RelatedCourseCard
                image={IMG.news3}
                title="Độc lập & phong kiến cực thịnh"
                rating="5.0"
                description="Kỷ nguyên độc lập tự chủ qua các triều đại phong kiến."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
