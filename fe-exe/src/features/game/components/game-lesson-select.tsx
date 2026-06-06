import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Gamepad2,
  Swords,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { IMG } from "@/lib/images";
import { chapterApi } from "@/features/course/api/course-api";
import { lessonApi } from "@/features/course/api/lesson-api";
import { quizApi } from "@/features/course/api/quiz-api";
import type { Chapter, Lesson } from "@/features/course/types";

interface ChapterWithLessons {
  chapter: Chapter;
  lessons: Lesson[];
}

export default function GameLessonSelect() {
  const { gameName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ChapterWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    if (gameName !== "vuot-rao") {
      setData([]);
      setLoading(false);
      setLoadError("Trò chơi này chưa có danh sách đề.");
      return;
    }

    let isMounted = true;

    async function loadGameLessons() {
      setLoading(true);
      setLoadError(null);

      try {
        const chapters = await chapterApi.getAllChapters();
        const allQuizzes = await quizApi.getAllQuizzes();
        const quizLessonIds = new Set(allQuizzes.map((quiz) => quiz.lessonId));

        const results = await Promise.all(
          chapters.map(async (chapter) => {
            try {
              const lessons = await lessonApi.getLessonsByChapterId(chapter._id);
              const lessonsWithQuiz = lessons.filter(
                (lesson) => lesson.quiz || quizLessonIds.has(lesson._id),
              );

              return lessonsWithQuiz.length > 0
                ? { chapter, lessons: lessonsWithQuiz }
                : null;
            } catch {
              return null;
            }
          }),
        );

        const chaptersWithLessons = results.filter(
          (item): item is ChapterWithLessons => item !== null,
        );

        if (!isMounted) return;
        setData(chaptersWithLessons);
        setExpandedChapter(chaptersWithLessons[0]?.chapter._id ?? null);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load game lesson list:", error);
        setLoadError("Không tải được danh sách đề. Vui lòng thử lại sau.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGameLessons();

    return () => {
      isMounted = false;
    };
  }, [gameName]);

  const toggleChapter = (id: string) => {
    setExpandedChapter((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#5c3a21]" size={40} />
          <p className="text-[#5c3a21] font-medium">Đang tải danh sách game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero Banner */}
      <div className="relative bg-[#5c3a21] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
          }}
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-10 py-16 flex items-center gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Gamepad2 size={28} className="text-yellow-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                Mini Games
              </span>
            </div>
            <h1 className="text-[48px] leading-[1.15] font-title font-bold italic mb-4">
              Kho trò chơi lịch sử
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Ôn tập kiến thức lịch sử qua các trò chơi hấp dẫn. Chọn bài học
              và bắt đầu thử thách ngay!
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 rounded-3xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center shadow-2xl">
              <img
                src={IMG.main}
                alt="Game character"
                className="w-32 h-32 object-contain drop-shadow-2xl animate-bounce"
                style={{ animationDuration: "3s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game list */}
      <div className="flex-1 bg-[#FFF6F4] py-12 px-10">
        <div className="max-w-[1280px] mx-auto">
          {/* Back button */}
          <button 
            type="button" 
            onClick={() => navigate('/game/list')}
            className="flex items-center gap-2 text-[#5c3a21] hover:text-[#7a4e2d] font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách trò chơi
          </button>

          {/* Game Type Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Swords size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#5c3a21] capitalize">
                Vượt rào
              </h2>
              <p className="text-sm text-gray-500">
                Danh sách đầy đủ bài quiz từ tất cả chapter và lesson có thể chơi.
              </p>
            </div>
          </div>

          {loadError ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">{loadError}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Chưa có bài học nào có quiz để chơi game.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map(({ chapter, lessons }) => {
                const isExpanded = expandedChapter === chapter._id;
                return (
                  <div
                    key={chapter._id}
                    className="rounded-2xl border border-[#5c3a21]/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Chapter Header */}
                    <button
                      type="button"
                      onClick={() => toggleChapter(chapter._id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#5c3a21]/[0.02] transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#5c3a21]/5">
                        {chapter.coverImageUrl ? (
                          <img
                            src={chapter.coverImageUrl}
                            alt={chapter.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen
                              size={24}
                              className="text-[#5c3a21]/30"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#5c3a21] text-lg truncate">
                          {chapter.title}
                        </h3>
                        {chapter.description && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                            {chapter.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {lessons.length} bài học
                        </p>
                      </div>
                      <div className="shrink-0 text-[#5c3a21]/40">
                        {isExpanded ? (
                          <ChevronUp size={22} />
                        ) : (
                          <ChevronDown size={22} />
                        )}
                      </div>
                    </button>

                    {/* Lessons */}
                    {isExpanded && (
                      <div className="border-t border-[#5c3a21]/5 bg-[#fdf8f4]">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson._id}
                            className="flex items-center gap-4 px-6 py-4 border-b border-[#5c3a21]/5 last:border-b-0 hover:bg-white/60 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center shrink-0">
                              <Gamepad2
                                size={18}
                                className="text-amber-700"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[#5c3a21] text-sm truncate">
                                {lesson.title}
                              </p>
                              {lesson.progress?.status === "completed" && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Trophy size={12} className="text-emerald-500" />
                                  <span className="text-xs text-emerald-600 font-semibold">
                                    Đã hoàn thành
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={lesson.isLocked}
                              onClick={() => navigate(`/game/vuot-rao/${lesson._id}`)}
                              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5c3a21] to-[#7a4e2d] text-white text-sm font-bold hover:from-[#4a2e1a] hover:to-[#5c3a21] transition-all shadow-md shadow-[#5c3a21]/20 hover:shadow-lg hover:shadow-[#5c3a21]/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:hover:translate-y-0"
                            >
                              <Gamepad2 size={16} />
                              {lesson.isLocked ? "Chưa mở khóa" : "Chơi ngay"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
