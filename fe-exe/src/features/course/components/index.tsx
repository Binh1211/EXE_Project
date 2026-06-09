import { useEffect, useState, type ComponentType } from "react";
import {
  Home,
  BookOpen,
  Activity,
  Star,
  User,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PlayCircle,
  Lock,
} from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router";
import { IMG } from "@/lib/images";
import { useNavigate, useParams } from "react-router";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { getStoredUser } from "@/features/auth/lib/auth-session";
import { API_BASE_URL } from "@/lib/api-client";
import { chapterApi } from "../api/course-api";
import { timelineApi } from "@/features/timeLine/api/timeline-api";
import type { Timeline } from "@/features/timeLine/types";
import type { Chapter } from "../types";
import { isChapterLevelLocked } from "../hooks/useChapterAccess";

const ITEMS_PER_PAGE = 4;

const SidebarItem = ({
  icon: Icon,
  text,
  active = false,
  isPro = false,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  text: string;
  to: string;
  active?: boolean;
  isPro?: boolean;
}) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? "bg-[#5c3a21] text-white" : "text-gray-700 hover:bg-white/50"
        }`}
    >
      <Icon size={20} className={active ? "text-white" : "text-gray-600"} />
      <span
        className={`font-medium text-sm flex-1 ${active ? "text-white" : "text-gray-800"
          }`}
      >
        {text}
      </span>
      {isPro && (
        <span className="text-[10px] bg-[#eab308] text-white px-2 py-0.5 rounded-full font-bold">
          PRO
        </span>
      )}
    </div>
  );
};

const CourseRow = ({
  course,
  userLevel,
  timeLineSlug,
}: {
  course: Chapter;
  userLevel: number;
  timeLineSlug: string;
}) => {
  const navigate = useNavigate();
  const { user } = useAuthUser();

  const { slug, coverImageUrl, title, description } = course;

  const levelRequired = course.requiredLevel ?? 1;
  const isLocked = isChapterLevelLocked(course, userLevel);

  const handleClick = () => {
    if (isLocked) {
      navigate("/vip");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    navigate(`/course/${timeLineSlug}/chapter/${slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 transition-colors px-4 hover:bg-white/50 cursor-pointer"
    >
      <div className="flex items-center gap-4 md:col-span-8 pr-0 md:pr-4 w-full">
        <img
          src={coverImageUrl || "https://placehold.co/300x200"}
          alt={title}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shrink-0"
        />

        <div className="flex flex-col justify-center min-w-0">
          <h4 className="font-bold text-gray-800 text-base mb-1 truncate">{title}</h4>

          {description && (
            <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      <div className="md:col-span-4 flex items-center w-full justify-start md:justify-end mt-3 md:mt-0">
        {isLocked ? (
          <span className="text-sm font-bold text-white bg-[#b45309] px-3 py-1 rounded-full flex items-center gap-1">
            <Lock size={12} />
            Level {levelRequired}
          </span>
        ) : (
          <span className="text-sm font-bold text-white bg-[#b45309] px-3 py-1 rounded-full">
            Level {levelRequired}
          </span>
        )}
      </div>
    </div>
  );
};

export default function CoursePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const stored = getStoredUser();
  const displayName = user?.fullName || stored?.fullName || "User";
  const rawAvatarUrl = user?.avatarUrl || stored?.avatarUrl;

  // Construct full URL if it's a relative path
  const avatarUrl = rawAvatarUrl?.startsWith("http")
    ? rawAvatarUrl
    : rawAvatarUrl
      ? `${API_BASE_URL}${rawAvatarUrl}`
      : undefined;

  // Lấy level của user, mặc định là 1 nếu chưa có
  const userLevel: number = user?.level ?? stored?.level ?? 1;

  const slugTimeline = useParams().slug ?? "";
  const [searchParams] = useSearchParams();
  const classFilter = searchParams.get("class");
  const classNum = classFilter ? Number(classFilter) : null;

  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [timelines, setTimelines] = useState<Timeline[]>([]);

  useEffect(() => {
    if (!slugTimeline) return;

    if (slugTimeline === "all") {
      timelineApi.getTimelines().then(setTimelines).catch(console.error);
    } else {
      timelineApi
        .getTimelineBySlug(slugTimeline)
        .then((data: Timeline) => {
          setTimeline(data);
        })
        .catch((error: Error) => {
          console.error("Failed to fetch timeline:", error);
        });
    }
  }, [slugTimeline]);
  const [courses, setCourses] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!timeline?._id) return;
    chapterApi
      .getChaptersByTimelineId(timeline._id)
      .then((data) => setCourses(data))
      .catch((error) => console.error("Failed to fetch chapters:", error));
  }, [timeline?._id]);

  useEffect(() => {
    if (slugTimeline === "all") {
      if (classNum && [10, 11, 12].includes(classNum)) {
        chapterApi
          .getChaptersByClass(classNum)
          .then((data) => setCourses(data))
          .catch((error) => console.error("Failed to fetch chapters by class:", error));
      } else {
        chapterApi
          .getAllChapters()
          .then((data) => setCourses(data))
          .catch((error) => console.error("Failed to fetch all chapters:", error));
      }
    }
  }, [slugTimeline, classNum]);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  // Slice danh sách khóa học theo trang hiện tại
  const pagedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div
      className="min-h-screen font-sans flex overflow-hidden"
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
      }}
    >
      {/* Left Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-shrink-0 flex flex-col items-center py-8 px-6 border-r border-black/5">
        <Link to="/" className="mb-10 flex flex-col items-center">
          <img src={IMG.logo} alt="EXE" />
        </Link>

        <nav className="w-full flex-1 flex flex-col gap-2">
          <SidebarItem icon={Home} text="Trang chủ" to="/" />
          <SidebarItem
            icon={BookOpen}
            text="Khóa học của bạn"
            to="/course"
            active={location.pathname === "/course"}
          />
          <SidebarItem icon={Activity} text="Tình trạng" to="/vip" isPro />
          <SidebarItem icon={Star} text="Đánh giá" to="/vip" isPro />
          <SidebarItem
            icon={User}
            text="Tài khoản"
            to={user ? "/profile" : "/login"}
          />
        </nav>

        <div className="w-full bg-[#fdf8e7] rounded-xl p-5 mt-auto text-center border border-black/5">
          <h4 className="font-bold text-gray-800 text-sm mb-2">
            Nâng cấp tài khoản
          </h4>
          <p className="text-[10px] text-gray-500 mb-4">
            Khám phá các tính năng mới thông qua việc đăng ký các gói nâng cấp
            của chúng tôi
          </p>
          <button
            type="button"
            onClick={() => navigate("/vip")}
            className="w-full bg-[#5c3a21] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#4a2e1a] transition-colors"
          >
            Nâng cấp ngay
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl text-gray-800 font-serif mb-1">
                Xin chào, <span className="font-bold">{displayName}</span>
              </h2>
              <p className="text-gray-500 text-sm">
                Hãy cùng nhau học thêm nhiều kiến thức mới nào!
              </p>
              {slugTimeline === "all" && (
                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => navigate("/course/all")}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${!classNum
                      ? "bg-[#5c3a21] text-white shadow-md"
                      : "bg-white/80 text-gray-600 border border-gray-200 hover:border-[#5c3a21]/50 hover:bg-white"
                      }`}
                  >
                    Tất cả
                  </button>
                  {[10, 11, 12].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => navigate(`/course/all?class=${cls}`)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${classNum === cls
                        ? "bg-[#5c3a21] text-white shadow-md"
                        : "bg-white/80 text-gray-600 border border-gray-200 hover:border-[#5c3a21]/50 hover:bg-white"
                        }`}
                    >
                      Lớp {cls}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Course List */}
          <div>
            <div className="bg-white/40 rounded-2xl overflow-hidden border border-black/5 shadow-sm">
              {/* Table Header */}
              <div className="bg-[#5c3a21] text-white rounded-t-2xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">Tên khóa học</div>
                  <div className="font-semibold text-sm">Trạng thái</div>
                </div>
              </div>

              {pagedCourses.map((c) => {
                const actualTimelineSlug =
                  slugTimeline === "all"
                    ? timelines.find((t) => t._id === c.timelineId)?.slug || "all"
                    : slugTimeline;
                return (
                  <CourseRow
                    key={c._id}
                    course={c}
                    timeLineSlug={actualTimelineSlug}
                    userLevel={userLevel}
                  />
                );
              })}

              {/* Pagination */}
              <div className="p-4 flex justify-center items-center gap-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-3 text-sm font-medium">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${page === currentPage
                          ? "bg-[#5c3a21] text-white"
                          : "hover:bg-gray-100 text-gray-600"
                          }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-[320px] flex-shrink-0 bg-white/40 border-l border-black/5 h-screen overflow-y-auto px-6 py-8 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)]">
        {/* Profile */}
        <div className="mb-10 w-full">
          <h3 className="font-bold text-gray-800 text-lg mb-4">Hồ sơ</h3>
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h4 className="font-bold text-gray-800 text-sm">{displayName}</h4>
              <p className="text-xs text-gray-500">
                Lịch sử & Văn minh thế giới
              </p>
            </div>
          </div>
        </div>

        {/* Highlighted Courses */}
        <div className="mb-10 w-full">
          <h3 className="font-bold text-gray-800 text-lg mb-4">
            Khóa học nổi bật
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#fefce8] text-[#eab308] flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">
                    Lịch Sử Việt Nam Qua Các Thời Kỳ
                  </h4>
                  <p className="text-[10px] text-gray-400">12+ khóa học</p>
                </div>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold py-1 px-3 rounded-2xl transition-colors whitespace-nowrap">
                Xem Khóa Học
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-10 rounded-full bg-[#fee2e2] text-[#ef4444] flex items-center justify-center">
                  <PlayCircle size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">
                    Lịch Sử Thế Giới
                  </h4>
                  <p className="text-[10px] text-gray-400">10+ khóa học</p>
                </div>
              </div>
              <button className="bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#be185d] text-[10px] font-bold py-1 px-3 rounded-2xl transition-colors whitespace-nowrap">
                Xem Khóa Học
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-10 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">
                    Các Cuộc Chiến Tranh Lớn
                  </h4>
                  <p className="text-[10px] text-gray-400">8+ khóa học</p>
                </div>
              </div>
              <button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] text-[10px] font-bold py-1 px-3 rounded-2xl transition-colors whitespace-nowrap">
                Xem Khóa Học
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
