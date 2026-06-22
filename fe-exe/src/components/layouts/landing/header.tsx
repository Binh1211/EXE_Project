import { Search, Menu, X, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import AvatarDropdown from "@/features/auth/components/AvatarDropdown";
import { IMG } from "@/lib/images";
import { timelineApi } from "@/features/timeLine/api/timeline-api";
import type { Timeline } from "@/features/timeLine/types";
import { API_BASE_URL } from "@/lib/api-client";

function MobileCoursesMenu({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [classesOpen, setClassesOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-3 py-2 flex items-center justify-between"
      >
        <span>Khóa học</span>
        <span className="ml-2">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="pl-4">
          <button
            onClick={() => onNavigate("/time-line")}
            className="w-full text-left px-3 py-2"
          >
            Time Line Lịch sử
          </button>
          <button
            onClick={() => onNavigate("/course/all")}
            className="w-full text-left px-3 py-2"
          >
            Kho học liệu
          </button>
          <button
            onClick={() => onNavigate("/flashcard-rooms/join")}
            className="w-full text-left px-3 py-2"
          >
            Ôn thi
          </button>

          <div>
            <button
              onClick={() => setClassesOpen((v) => !v)}
              className="w-full text-left px-3 py-2 flex items-center justify-between"
            >
              <span>Lớp học</span>
              <span className="ml-2">{classesOpen ? "▲" : "▼"}</span>
            </button>
            {classesOpen && (
              <div className="pl-4">
                <button onClick={() => onNavigate("/course/all?class=10")} className="w-full text-left px-3 py-2">Lớp 10</button>
                <button onClick={() => onNavigate("/course/all?class=11")} className="w-full text-left px-3 py-2">Lớp 11</button>
                <button onClick={() => onNavigate("/course/all?class=12")} className="w-full text-left px-3 py-2">Lớp 12</button>
              </div>
            )}
          </div>

          <button onClick={() => onNavigate("/news")} className="w-full text-left px-3 py-2">Sách</button>
        </div>
      )}
    </div>
  );
}

type SearchScope = "all" | "timeline" | "course";

type CourseHit = { id: string; title: string };

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthUser();
  const { isDark, toggleTheme } = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");
  const [showResults, setShowResults] = useState(false);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [courses, setCourses] = useState<CourseHit[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    timelineApi
      .getTimelines()
      .then(setTimelines)
      .catch(() => setTimelines([]));

    fetch(`${API_BASE_URL}/courses`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(
            data.map((c: { id: string; title: string }) => ({
              id: c.id,
              title: c.title,
            })),
          );
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = searchQuery.trim().toLowerCase();

  const timelineResults = useMemo(() => {
    if (!q || searchScope === "course") return [];
    return timelines.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.displayTime.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false),
    );
  }, [q, timelines, searchScope]);

  const courseResults = useMemo(() => {
    if (!q || searchScope === "timeline") return [];
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [q, courses, searchScope]);

  const hasResults = timelineResults.length > 0 || courseResults.length > 0;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && q) {
      if (timelineResults[0]) {
        navigate(`/time-line?slug=${timelineResults[0].slug}`);
      } else if (courseResults[0]) {
        navigate(`/course/${courseResults[0].id}`);
      } else if (searchScope === "timeline" || searchScope === "all") {
        navigate("/time-line");
      } else {
        navigate("/course");
      }
      setShowResults(false);
    }
  };


  const [activeDropdown, setActiveDropdown] = useState<"home" | "courses" | null>(null);
  const [dropdownPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const [classesSubOpen, setClassesSubOpen] = useState(false);


  const hideDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <header
      className="sticky top-0 z-[200] isolate w-full backdrop-blur shadow-sm transition-colors duration-500"
      style={{ backgroundColor: isDark ? "#1E0F05" : "#fbf0ce" }}
    >
      <div className="relative z-[200] mx-auto flex h-20 items-center justify-between gap-7 px-6">
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
          aria-label="Về trang chủ"
        >
          <img
            src={isDark ? IMG.logoWhite : IMG.logo}
            alt="EXE"
            className="h-16 w-auto object-contain transition-opacity duration-500"
          />
        </button>

        <div ref={searchRef} className="relative z-[210] w-[40%]">
          <div
            className="flex h-10 items-center rounded-xl px-1 py-5 transition-colors duration-500"
            style={{ backgroundColor: isDark ? "#3D2010" : "white" }}
          >
            <Search className="ml-4 inline h-4 w-4 text-gray-400" />
            <input
              className="w-full text-sm focus:outline-none bg-transparent"
              style={{ color: isDark ? "#F5DEB3" : "inherit" }}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Tìm timeline, khóa học..."
            />
            <Select
              value={searchScope}
              onValueChange={(v) => setSearchScope(v as SearchScope)}
            >
              <SelectTrigger
                className="h-8 w-[28%] rounded-xl border-none"
                style={{
                  backgroundColor: isDark ? "#5C3317" : "#fff3e9",
                  color: isDark ? "#F5DEB3" : "#5f3713",
                }}
              >
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="z-[300] rounded-xl bg-[#fff3e9] text-[#5f3713]">
                <SelectGroup>
                  <SelectItem
                    value="all"
                    className="rounded-xl data-[highlighted]:border-l-2 data-[highlighted]:border-[#623715] data-[highlighted]:bg-[#f3e2d3]"
                  >
                    Tất cả
                  </SelectItem>
                  <SelectItem
                    value="timeline"
                    className="rounded-xl data-[highlighted]:border-l-2 data-[highlighted]:border-[#623715] data-[highlighted]:bg-[#f3e2d3]"
                  >
                    Timeline
                  </SelectItem>
                  <SelectItem
                    value="course"
                    className="rounded-xl data-[highlighted]:border-l-2 data-[highlighted]:border-[#623715] data-[highlighted]:bg-[#f3e2d3]"
                  >
                    Khóa học
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {showResults && q && (
            <div className="absolute left-0 right-0 top-full z-[300] mt-1 max-h-72 overflow-y-auto rounded-xl border border-[#e8d5c4] bg-white py-2 shadow-xl">
              {!hasResults && (
                <p className="px-4 py-3 text-sm text-gray-500">
                  Không tìm thấy kết quả
                </p>
              )}
              {timelineResults.length > 0 && (
                <div>
                  <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#a88d7a]">
                    Timeline
                  </p>
                  {timelineResults.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      className="block w-full px-4 py-2.5 text-left text-sm hover:bg-[#f3e2d3]"
                      onClick={() => {
                        navigate(`/time-line?slug=${t.slug}`);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="font-medium text-[#5f3713]">
                        {t.title}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {t.displayTime}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {courseResults.length > 0 && (
                <div>
                  <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#a88d7a]">
                    Khóa học
                  </p>
                  {courseResults.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="block w-full px-4 py-2.5 text-left text-sm hover:bg-[#f3e2d3]"
                      onClick={() => {
                        navigate(`/course/${c.id}`);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="font-medium text-[#5f3713]">
                        {c.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="relative z-[210] hidden items-center gap-4 md:flex">
          <div className="group relative inline-block">
            <button
              type="button"
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: isDark ? "#F5DEB3" : "inherit" }}
              onClick={() => navigate("/")}
            >
              Trang chủ
            </button>
            <div
              className="invisible absolute left-0 z-[220] mt-2 w-40 rounded-xl p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100"
              style={{ backgroundColor: isDark ? "#3D2010" : "#fff3e9" }}
            >
              <Link
                to="/"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Về Vistory
              </Link>
              <Link
                to="/#team"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Thành phần
              </Link>
              <Link
                to="/#features"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Tính năng
              </Link>
              <Link
                to="/#benefits"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Lợi ích
              </Link>
            </div>
          </div>

          <div className="group relative inline-block">
            <button
              type="button"
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: isDark ? "#F5DEB3" : "inherit" }}
              onClick={() => navigate("/time-line")}
            >
              Khóa học
            </button>
            <div
              className="invisible absolute left-0 z-[220] mt-2 w-44 rounded-xl p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100"
              style={{ backgroundColor: isDark ? "#3D2010" : "#fff3e9" }}
            >
              <Link
                to="/time-line"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Time Line Lịch sử
              </Link>
              <Link
                to="/course/all"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Kho học liệu
              </Link>
              <Link
                to="/flashcard-rooms/join"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Ôn thi
              </Link>
              <div className="group/lophoc relative">
                <div
                  className={`flex items-center justify-between rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black cursor-pointer ${isDark ? "text-[#F5DEB3]" : ""}`}
                >
                  Lớp học
                  <svg className="ml-1 h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M4.5 2l4 4-4 4" />
                  </svg>
                </div>
                <div className="invisible absolute left-full top-0 z-[230] ml-1 w-36 rounded-xl p-1 opacity-0 shadow-lg transition-all duration-200 group-hover/lophoc:visible group-hover/lophoc:opacity-100"
                  style={{ backgroundColor: isDark ? "#3D2010" : "#fff3e9" }}
                >
                  <Link
                    to="/course/all?class=10"
                    className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
                  >
                    Lớp 10
                  </Link>
                  <Link
                    to="/course/all?class=11"
                    className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
                  >
                    Lớp 11
                  </Link>
                  <Link
                    to="/course/all?class=12"
                    className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
                  >
                    Lớp 12
                  </Link>
                </div>
              </div>

              <Link
                to="/news"
                className={`flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] hover:!text-black ${isDark ? "text-[#F5DEB3]" : ""}`}
              >
                Sách
              </Link>
            </div>
          </div>
          <div className="group relative inline-block">
            <button
              type="button"
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: isDark ? "#F5DEB3" : "inherit" }}
              onClick={() => navigate("/game/list")}
            >
              Game
            </button>
          </div>
          <Link
            to="/contact"
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: isDark ? "#F5DEB3" : "inherit" }}
          >
            Liên hệ
          </Link>
          <Link
            to="/news"
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: isDark ? "#F5DEB3" : "inherit" }}
          >
            Tin tức
          </Link>
        </nav>

        <div className="relative z-[210] flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: isDark ? "#5C3317" : "#f3e2d3",
              color: isDark ? "#F5DEB3" : "#5f3713",
            }}
            aria-label={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isLoggedIn ? (
            <AvatarDropdown />
          ) : (
            <>
              <Button
                className="w-24 rounded-xl text-sm font-medium shadow-none hover:rounded-xl transition-colors duration-300"
                style={{
                  color: isDark ? "#F5DEB3" : "#000",
                  backgroundColor: "transparent",
                }}
                onClick={() => navigate(AUTH_ROUTES.login)}
              >
                Đăng nhập
              </Button>
              <Button
                className="w-24 rounded-xl text-sm font-medium text-white shadow-none ring-0 hover:scale-105 hover:rounded-xl hover:ring-2 hover:ring-[#f7f7f7] transition-all duration-300"
                style={{ backgroundColor: isDark ? "#8B4513" : "#5f3713" }}
                onClick={() => navigate(AUTH_ROUTES.register)}
              >
                Đăng ký
              </Button>
            </>
          )}
          <button
            type="button"
            className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Mở menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-[210] bg-[#fff3e9] p-4 shadow-lg">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/");
              }}
              className="text-left px-3 py-2"
            >
              Trang chủ
            </button>

            <MobileCoursesMenu
              onNavigate={(path) => {
                setMobileOpen(false);
                navigate(path);
              }}
            />

            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/game/list");
              }}
              className="text-left px-3 py-2"
            >
              Game
            </button>

            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/contact");
              }}
              className="text-left px-3 py-2"
            >
              Liên hệ
            </button>

            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/news");
              }}
              className="text-left px-3 py-2"
            >
              Tin tức
            </button>

            {!isLoggedIn && (
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(AUTH_ROUTES.login);
                  }}
                  className="flex-1"
                >
                  Đăng nhập
                </Button>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(AUTH_ROUTES.register);
                  }}
                  className="flex-1 bg-[#5f3713] text-white"
                >
                  Đăng ký
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {activeDropdown && dropdownPos
        ? createPortal(
          <div
            style={{
              position: "absolute",
              left: dropdownPos.left,
              top: dropdownPos.top,
              zIndex: 10000,
              minWidth: 200,
            }}
            onMouseEnter={() => {
              // keep submenu visible while mouse is inside the portal
              setClassesSubOpen(true);
            }}
            onMouseLeave={() => {
              setClassesSubOpen(false);
              hideDropdown();
            }}
          >
            <div className="rounded-xl bg-[#fff3e9] p-1 shadow-lg">
              {activeDropdown === "home" ? (
                <div className="w-40">
                  <Link
                    to="/"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Về Vistory
                  </Link>
                  <Link
                    to="/#team"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Thành phần
                  </Link>
                  <Link
                    to="/#features"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Tính năng
                  </Link>
                  <Link
                    to="/#benefits"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Lợi ích
                  </Link>
                </div>
              ) : (
                <div className="w-44 relative">
                  <Link
                    to="/time-line"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Time Line Lịch sử
                  </Link>
                  <Link
                    to="/course/all"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Kho học liệu
                  </Link>
                  <Link
                    to="/flashcard-rooms/join"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Ôn thi
                  </Link>
                  <div
                    className="border-t mt-1 pt-1 relative"
                    onMouseEnter={() => setClassesSubOpen(true)}
                    onMouseLeave={() => setClassesSubOpen(false)}
                  >
                    <div className="text-sm px-2 py-2 rounded-xl hover:bg-[#f3e2d3] flex items-center justify-between">
                      <span>Lớp học</span>
                      <span className="ml-2 text-xs">›</span>
                    </div>
                    {classesSubOpen && (
                      <div style={{ left: 'calc(100% - 8px)', top: 0 }} className="absolute w-36 rounded-lg bg-[#fff3e9] p-1 shadow-lg">
                        <Link
                          to="/course/all?class=10"
                          className="block px-2 py-1 text-sm hover:bg-[#f3e2d3] rounded-md"
                        >
                          Lớp 10
                        </Link>
                        <Link
                          to="/course/all?class=11"
                          className="block px-2 py-1 text-sm hover:bg-[#f3e2d3] rounded-md"
                        >
                          Lớp 11
                        </Link>
                        <Link
                          to="/course/all?class=12"
                          className="block px-2 py-1 text-sm hover:bg-[#f3e2d3] rounded-md"
                        >
                          Lớp 12
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/news"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] mt-1"
                  >
                    Sách
                  </Link>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
        : null}
    </header>
  );
}
