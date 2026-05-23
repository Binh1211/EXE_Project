import React, { useEffect, useState } from "react";
import {
  Home,
  MessageSquare,
  BookOpen,
  Activity,
  Star,
  User,
  Video,
  Bell,
  CheckCircle2,
  GraduationCap,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  MapPin,
  PlayCircle,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  clearAuthSession,
  getStoredUser,
} from "@/features/auth/lib/auth-session";
import { API_BASE_URL } from "@/lib/api-client";

const ITEMS_PER_PAGE = 4;

const SidebarItem = ({
  icon: Icon,
  text,
  active = false,
  isPro = false,
}: any) => {
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

const StatCard = ({ icon: Icon, title, value, iconBg, cardBg }: any) => {
  return (
    <div
      className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-4 ${cardBg} shadow-sm border border-black/5`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${iconBg}`}
      >
        <Icon size={24} />
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

const CourseRow = ({
  course,
  absoluteIndex,
  userLevel,
}: {
  course: any;
  absoluteIndex: number;
  userLevel: number;
}) => {
  const navigate = useNavigate();
  const { user } = useAuthUser();

  const { id, image, title, description } = course;

  // Level 1 chỉ được phép click vào 2 khóa đầu tiên (absoluteIndex 0 và 1)
  const isLocked = userLevel <= 1 && absoluteIndex >= 2;
  const isPremium = absoluteIndex >= 2;

  const handleClick = () => {
    if (isLocked) return;
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/course/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 transition-colors px-4 ${isLocked
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-white/50 cursor-pointer"
        }`}
    >
      <div className="col-span-8 flex gap-4 pr-4">
        <img
          src={image}
          alt={title}
          className="w-24 h-24 object-cover rounded-xl shrink-0"
        />
        <div className="flex flex-col justify-center">
          <h4 className="font-bold text-gray-800 text-base mb-1">{title}</h4>
          {description && (
            <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      <div className="col-span-4 flex items-center">
        {isLocked ? (
          <span className="text-sm font-bold text-white bg-gray-500 px-3 py-1 rounded-full flex items-center gap-1">
            <Lock size={12} />
            Cần nâng cấp
          </span>
        ) : isPremium ? (
          <span className="text-sm font-bold text-white bg-[#b45309] px-3 py-1 rounded-full">
            Premium
          </span>
        ) : null}
      </div>
    </div>
  );
};

const RegionBar = ({ name, users, percentage, color }: any) => {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-medium text-gray-600 w-24 truncate">
        {name}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-6 flex items-center relative overflow-hidden">
        <div
          className={`h-full ${color} opacity-20 absolute left-0 top-0`}
          style={{ width: percentage }}
        ></div>
        <div className="flex items-center justify-center w-full relative z-10 gap-1 text-[10px] font-medium text-gray-700">
          <MapPin size={10} /> {users}
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500 w-8 text-right">
        {percentage}
      </span>
    </div>
  );
};

export default function CoursePage() {
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

  const initialCourses = [
    {
      id: "ww2",
      image: "/img/news1.png",
      title: "Chiến Tranh Thế Giới II",
      description:
        "Hiểu rõ nguyên nhân dẫn đến Chiến tranh Thế giới II, các sự kiện quan trọng và tác động của các cuộc chiến đối với thế giới hiện đại.",
      views: "17,913",
      students: "62",
    },
    {
      id: "civilizations",
      image: "/img/news2.png",
      title: "Các Nền Văn Minh Lớn Trong Lịch Sử",
      description:
        "Tìm hiểu cách các nền văn minh phát triển, giao thương và ảnh hưởng đến thế giới hiện đại.",
      views: "64,142",
      students: "21",
    },
    {
      id: "ww1-ww2",
      image: "/img/news3.png",
      title: "Chiến Tranh Thế Giới I & II",
      description:
        "Phân tích nguyên nhân, diễn biến và hậu quả của hai cuộc chiến lớn nhất trong lịch sử nhân loại.",
      views: "38,841",
      students: "43",
    },
    {
      id: "vn-history",
      image: "/img/news1.png",
      title: "Lịch Sử Việt Nam Từ Cổ Đại Đến Hiện Đại",
      description:
        "Hành trình qua các triều đại, các cuộc kháng chiến và sự phát triển của Việt Nam.",
      views: "53,814",
      students: "181",
    },
    {
      id: "empires",
      image: "/img/news2.png",
      title: "Các Đế Chế Lớn Trong Lịch Sử Nhân Loại",
      description:
        "Tìm hiểu về đế chế La Mã, Mông Cổ, Ottoman và cách họ thay đổi thế giới.",
      views: "21,741",
      students: "73",
    },
    {
      id: "liberation",
      image: "/img/news3.png",
      title: "Phong Trào Giải Phóng Dân Tộc Trên Thế Giới",
      description:
        "Khám phá các cuộc đấu tranh giành độc lập của nhiều quốc gia trên thế giới.",
      views: "18,853",
      students: "31",
    },
  ];

  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  // Slice danh sách khóa học theo trang hiện tại
  const pagedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data)) {
          setCourses(data);
          setCurrentPage(1); // reset về trang 1 khi fetch xong
        }
      } catch (err) {
        // giữ fallback courses
      }
    };
    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="min-h-screen font-sans flex overflow-hidden"
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
      }}
    >
      {/* Left Sidebar */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col items-center py-8 px-6 border-r border-black/5">
        <div className="flex flex-col items-center mb-10">
          <img src="/img/logo.png" alt="EXE" />
        </div>

        <nav className="w-full flex-1 flex flex-col gap-2">
          <SidebarItem icon={Home} text="Trang chủ" active />
          <SidebarItem icon={BookOpen} text="Khóa học của bạn" />
          <SidebarItem icon={Activity} text="Tình trạng" isPro />
          <SidebarItem icon={Star} text="Đánh giá" isPro />
          <SidebarItem icon={User} text="Tài khoản" />
        </nav>

        <div className="w-full bg-[#fdf8e7] rounded-xl p-5 mt-auto text-center border border-black/5">
          <h4 className="font-bold text-gray-800 text-sm mb-2">
            Nâng cấp tài khoản
          </h4>
          <p className="text-[10px] text-gray-500 mb-4">
            Khám phá các tính năng mới thông qua việc đăng ký các gói nâng cấp
            của chúng tôi
          </p>
          <button className="w-full bg-[#5c3a21] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#4a2e1a] transition-colors">
            Nâng cấp ngay
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-8 max-w-[1200px] w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl text-gray-800 font-serif mb-1">
                Xin chào, <span className="font-bold">{displayName}</span>
              </h2>
              <p className="text-gray-500 text-sm">
                Hãy cùng nhau học thêm nhiều kiến thức mới nào!
              </p>
            </div>
          </div>

          {/* Course List */}
          <div>
            <div className="bg-white/40 rounded-2xl overflow-hidden border border-black/5 shadow-sm">
              {/* Table Header */}
              <div className="bg-[#5c3a21] text-white grid grid-cols-12 gap-4 px-4 py-3 rounded-t-2xl">
                <div className="col-span-8 font-semibold text-sm pl-4">
                  Tên khóa học
                </div>
                <div className="col-span-4 font-semibold text-sm">
                  Trạng thái
                </div>
              </div>

              {pagedCourses.map((c, idx) => {
                // absoluteIndex = vị trí thực trong toàn bộ danh sách (không phụ thuộc trang)
                const absoluteIndex =
                  (currentPage - 1) * ITEMS_PER_PAGE + idx;
                return (
                  <CourseRow
                    key={c.id}
                    course={c}
                    absoluteIndex={absoluteIndex}
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
                    )
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
      <aside className="w-[320px] flex-shrink-0 bg-white/40 border-l border-black/5 h-screen overflow-y-auto px-6 py-8 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)]">
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

        {/* Next Lesson */}
        <div className="w-full pt-6 border-t border-black/5">
          <h3 className="font-bold text-gray-800 text-sm mb-4">
            Bài học tiếp theo
          </h3>
          <div className="text-center mb-4">
            <h4 className="font-title font-bold text-gray-800 text-base mb-1">
              Bài 5: Sự sụp đổ của Đế chế La Mã
            </h4>
            <p className="text-xs text-gray-500">Thời lượng: 20 phút</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md relative group cursor-pointer">
            <img
              src="/img/news1.png"
              alt="Roman Empire"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[#5c3a21]">
                <PlayCircle size={28} />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}