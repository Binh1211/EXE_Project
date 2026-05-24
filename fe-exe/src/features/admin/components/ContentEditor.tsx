import { useCallback, useEffect, useState } from "react";
import {
  adminApi,
  getApiErrorMessage,
  type AdminChapter,
  type AdminLesson,
  type AdminTimeline,
} from "../api/admin-api";
import { ListTree, RefreshCw } from "lucide-react";
import {
  AdminBadge,
  AdminBtnPrimary,
  AdminCard,
  AdminCardHeader,
  AdminColumnPanel,
  AdminErrorBox,
  AdminGhostBtn,
  AdminListItem,
  AdminLoading,
  adminInput,
  adminSelect,
} from "./admin-ui";

const emptyTimeline = {
  title: "",
  slug: "",
  description: "",
  displayTime: "",
  imageUrl: "/img/VL_AL.png",
};

const emptyChapter = {
  title: "",
  slug: "",
  description: "",
  order: 1,
  requiredLevel: 1,
  coverImageUrl: "",
};

const emptyLesson = {
  title: "",
  order: 1,
  isFree: false,
  isPublished: true,
  video: { url: "", provider: "youtube" as const, durationSec: 0 },
};

export function ContentEditor() {
  const [timelines, setTimelines] = useState<AdminTimeline[]>([]);
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);

  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  const [timelineData, setTimelineData] = useState(emptyTimeline);
  const [chapterData, setChapterData] = useState(emptyChapter);
  const [lessonData, setLessonData] = useState(emptyLesson);

  const fetchTimelines = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getTimelines();
      setTimelines(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setTimelines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChapters = useCallback(async (timelineId: string) => {
    try {
      const data = await adminApi.getChapters(timelineId);
      setChapters(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setChapters([]);
    }
  }, []);

  const fetchLessons = useCallback(async (chapterId: string) => {
    try {
      const data = await adminApi.getLessons(chapterId);
      setLessons(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setLessons([]);
    }
  }, []);

  useEffect(() => {
    fetchTimelines();
  }, [fetchTimelines]);

  useEffect(() => {
    if (selectedTimeline) {
      fetchChapters(selectedTimeline);
      setSelectedChapter(null);
      setLessons([]);
    } else {
      setChapters([]);
      setLessons([]);
    }
  }, [selectedTimeline, fetchChapters]);

  useEffect(() => {
    if (selectedChapter) fetchLessons(selectedChapter);
    else setLessons([]);
  }, [selectedChapter, fetchLessons]);

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await adminApi.createTimeline(timelineData);
      setShowTimelineForm(false);
      setTimelineData(emptyTimeline);
      await fetchTimelines();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm("Xóa giai đoạn và toàn bộ khóa học/bài giảng bên trong?")) return;
    setError("");
    try {
      await adminApi.deleteTimeline(id);
      if (selectedTimeline === id) {
        setSelectedTimeline(null);
        setSelectedChapter(null);
      }
      await fetchTimelines();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeline) return;
    setError("");
    try {
      await adminApi.createChapter({
        ...chapterData,
        timelineId: selectedTimeline,
        requiredLevel: chapterData.requiredLevel as 1 | 2 | 3,
      });
      setShowChapterForm(false);
      setChapterData(emptyChapter);
      await fetchChapters(selectedTimeline);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm("Xóa khóa học và tất cả bài giảng?")) return;
    setError("");
    try {
      await adminApi.deleteChapter(id);
      if (selectedChapter === id) setSelectedChapter(null);
      if (selectedTimeline) await fetchChapters(selectedTimeline);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChapter) return;
    setError("");
    try {
      await adminApi.createLesson({ ...lessonData, chapterId: selectedChapter });
      setShowLessonForm(false);
      setLessonData(emptyLesson);
      await fetchLessons(selectedChapter);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Xóa bài giảng này?")) return;
    setError("");
    try {
      await adminApi.deleteLesson(id);
      if (selectedChapter) await fetchLessons(selectedChapter);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  if (loading) {
    return <AdminLoading label="Đang tải cấu trúc nội dung..." />;
  }

  return (
    <AdminCard>
      <AdminCardHeader
        icon={ListTree}
        title="Cấu trúc nội dung"
        subtitle="Timeline → Khóa học → Bài giảng"
        action={
          <div className="flex items-center gap-2">
            <AdminBadge>{timelines.length} giai đoạn</AdminBadge>
            <AdminGhostBtn onClick={fetchTimelines}>
              <RefreshCw className="h-3.5 w-3.5" />
              Tải lại
            </AdminGhostBtn>
          </div>
        }
      />

      {error && <AdminErrorBox message={error} />}

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
        {/* Timeline */}
        <AdminColumnPanel
          title="Giai đoạn"
          count={timelines.length}
          showAdd
          onAdd={() => setShowTimelineForm(!showTimelineForm)}
        >
          {showTimelineForm && (
            <form onSubmit={handleTimelineSubmit} className="mb-3 space-y-2 rounded-xl border border-[#e8d5c4] bg-[#fff3e9] p-3">
              <input required placeholder="Tiêu đề" className={adminInput} value={timelineData.title} onChange={(e) => setTimelineData({ ...timelineData, title: e.target.value })} />
              <input placeholder="Slug" className={adminInput} value={timelineData.slug} onChange={(e) => setTimelineData({ ...timelineData, slug: e.target.value })} />
              <input required placeholder="Thời gian hiển thị" className={adminInput} value={timelineData.displayTime} onChange={(e) => setTimelineData({ ...timelineData, displayTime: e.target.value })} />
              <input placeholder="Mô tả" className={adminInput} value={timelineData.description} onChange={(e) => setTimelineData({ ...timelineData, description: e.target.value })} />
              <input required placeholder="URL ảnh" className={adminInput} value={timelineData.imageUrl} onChange={(e) => setTimelineData({ ...timelineData, imageUrl: e.target.value })} />
              <AdminBtnPrimary type="submit">Lưu giai đoạn</AdminBtnPrimary>
            </form>
          )}
          {timelines.length === 0 && !showTimelineForm ? (
            <p className="text-center text-sm text-stone-600 py-8">Chưa có giai đoạn — nhấn + để thêm</p>
          ) : (
            timelines.map((t) => (
              <AdminListItem
                key={t._id}
                active={selectedTimeline === t._id}
                onClick={() => setSelectedTimeline(t._id)}
                title={t.title}
                subtitle={t.displayTime}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDeleteTimeline(t._id);
                }}
              />
            ))
          )}
        </AdminColumnPanel>

        {/* Chapter */}
        <AdminColumnPanel
          title="Khóa học"
          count={selectedTimeline ? chapters.length : undefined}
          showAdd={!!selectedTimeline}
          onAdd={() => setShowChapterForm(!showChapterForm)}
          emptyHint={!selectedTimeline ? "← Chọn một giai đoạn" : undefined}
        >
          {selectedTimeline && (
            <>
              {showChapterForm && (
                <form onSubmit={handleChapterSubmit} className="mb-3 space-y-2 rounded-xl border border-[#e8d5c4] bg-[#fff3e9] p-3">
                  <input required placeholder="Tiêu đề khóa học" className={adminInput} value={chapterData.title} onChange={(e) => setChapterData({ ...chapterData, title: e.target.value })} />
                  <input type="number" required min={1} placeholder="Thứ tự" className={adminInput} value={chapterData.order} onChange={(e) => setChapterData({ ...chapterData, order: Number(e.target.value) })} />
                  <select className={adminSelect} value={chapterData.requiredLevel} onChange={(e) => setChapterData({ ...chapterData, requiredLevel: Number(e.target.value) })}>
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                  </select>
                  <AdminBtnPrimary type="submit">Lưu khóa học</AdminBtnPrimary>
                </form>
              )}
              {chapters.length === 0 && !showChapterForm ? (
                <p className="text-center text-sm text-stone-600 py-6">Chưa có khóa học</p>
              ) : (
                chapters.map((c) => (
                  <AdminListItem
                    key={c._id}
                    active={selectedChapter === c._id}
                    onClick={() => setSelectedChapter(c._id)}
                    title={`${c.order}. ${c.title}`}
                    subtitle={`Level ${c.requiredLevel}`}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(c._id);
                    }}
                  />
                ))
              )}
            </>
          )}
        </AdminColumnPanel>

        {/* Lesson */}
        <AdminColumnPanel
          title="Bài giảng"
          count={selectedChapter ? lessons.length : undefined}
          showAdd={!!selectedChapter}
          onAdd={() => setShowLessonForm(!showLessonForm)}
          emptyHint={!selectedChapter ? "← Chọn một khóa học" : undefined}
        >
          {selectedChapter && (
            <>
              {showLessonForm && (
                <form onSubmit={handleLessonSubmit} className="mb-3 space-y-2 rounded-xl border border-[#e8d5c4] bg-[#fff3e9] p-3">
                  <input required placeholder="Tiêu đề bài" className={adminInput} value={lessonData.title} onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })} />
                  <input type="number" required min={1} className={adminInput} value={lessonData.order} onChange={(e) => setLessonData({ ...lessonData, order: Number(e.target.value) })} />
                  <input placeholder="YouTube URL" className={adminInput} value={lessonData.video.url} onChange={(e) => setLessonData({ ...lessonData, video: { ...lessonData.video, url: e.target.value } })} />
                  <label className="flex items-center gap-2 text-xs text-stone-400">
                    <input type="checkbox" checked={lessonData.isFree} onChange={(e) => setLessonData({ ...lessonData, isFree: e.target.checked })} />
                    Miễn phí
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-400">
                    <input type="checkbox" checked={lessonData.isPublished} onChange={(e) => setLessonData({ ...lessonData, isPublished: e.target.checked })} />
                    Xuất bản
                  </label>
                  <AdminBtnPrimary type="submit">Lưu bài giảng</AdminBtnPrimary>
                </form>
              )}
              {lessons.length === 0 && !showLessonForm ? (
                <p className="text-center text-sm text-stone-600 py-6">Chưa có bài giảng</p>
              ) : (
                lessons.map((l) => (
                  <AdminListItem
                    key={l._id}
                    title={`${l.order}. ${l.title}`}
                    subtitle={`${l.isFree ? "Miễn phí" : "Premium"} · ${l.isPublished ? "Đã xuất bản" : "Nháp"}`}
                    onDelete={() => handleDeleteLesson(l._id)}
                  />
                ))
              )}
            </>
          )}
        </AdminColumnPanel>
      </div>
    </AdminCard>
  );
}
