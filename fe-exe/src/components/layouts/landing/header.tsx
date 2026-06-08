import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

type SearchScope = "all" | "timeline" | "course";

type CourseHit = { id: string; title: string };

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthUser();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");
  const [showResults, setShowResults] = useState(false);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [courses, setCourses] = useState<CourseHit[]>([]);

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
      .catch(() => {});
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

  return (
    <header className="sticky top-0 z-[200] isolate w-full bg-[#fbf0ce] backdrop-blur shadow-sm">
      <div className="relative z-[200] mx-auto flex h-20 items-center justify-between gap-7 px-6">
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
          aria-label="Về trang chủ"
        >
          <img
            src={IMG.logo}
            alt="EXE"
            className="h-16 w-auto object-contain"
          />
        </button>

        <div ref={searchRef} className="relative z-[210] w-[40%]">
          <div className="flex h-10 items-center rounded-xl bg-white px-1 py-5">
            <Search className="ml-4 inline h-4 w-4 text-gray-400" />
            <input
              className="w-full text-sm focus:outline-none"
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
              <SelectTrigger className="h-8 w-[28%] rounded-xl border-none bg-[#fff3e9] text-[#5f3713] [&>span]:text-[#5f3713] [&>span[data-placeholder]]:text-[#5f3713]">
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
              className="text-sm font-medium hover:text-[#5f3713]"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </button>
            <div className="invisible absolute left-0 z-[220] mt-2 w-40 rounded-xl bg-[#fff3e9] p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
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
          </div>

          <div className="group relative inline-block">
            <button
              type="button"
              className="text-sm font-medium hover:text-[#5f3713]"
              onClick={() => navigate("/time-line")}
            >
              Khóa học
            </button>
            <div className="invisible absolute left-0 z-[220] mt-2 w-44 rounded-xl bg-[#fff3e9] p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
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
              <div className="group/lophoc relative">
                <div className="flex items-center justify-between rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3] cursor-pointer">
                  Lớp học
                  <svg
                    className="ml-1 h-3 w-3"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path d="M4.5 2l4 4-4 4" />
                  </svg>
                </div>
                <div className="invisible absolute left-full top-0 z-[230] ml-1 w-36 rounded-xl bg-[#fff3e9] p-1 opacity-0 shadow-lg transition-all duration-200 group-hover/lophoc:visible group-hover/lophoc:opacity-100">
                  <Link
                    to="/course/all?class=10"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Lớp 10
                  </Link>
                  <Link
                    to="/course/all?class=11"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Lớp 11
                  </Link>
                  <Link
                    to="/course/all?class=12"
                    className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
                  >
                    Lớp 12
                  </Link>
                </div>
              </div>

              <Link
                to="/news"
                className="flex items-center rounded-xl px-2 py-3 text-sm transition-all hover:border-l-2 hover:border-[#623715] hover:bg-[#f3e2d3]"
              >
                Sách
              </Link>
            </div>
          </div>
          <div className="group relative inline-block">
            <button
              type="button"
              className="text-sm font-medium hover:text-[#5f3713]"
              onClick={() => navigate("/game/list")}
            >
              Game
            </button>
          </div>
          {/* <Link to="/vip" className="text-sm font-medium hover:text-[#5f3713]">
            Mua VIP
          </Link> */}
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-[#5f3713]"
          >
            Liên hệ
          </Link>
          <Link to="/news" className="text-sm font-medium hover:text-[#5f3713]">
            Tin tức
          </Link>
        </nav>

        <div className="relative z-[210] flex items-center gap-2">
          {isLoggedIn ? (
            <AvatarDropdown />
          ) : (
            <>
              <Button
                className="w-24 rounded-xl text-sm font-medium text-black shadow-none hover:rounded-xl hover:text-[#5f3713]"
                onClick={() => navigate(AUTH_ROUTES.login)}
              >
                Đăng nhập
              </Button>
              <Button
                className="w-24 rounded-xl bg-[#5f3713] text-sm font-medium text-white shadow-none ring-0 hover:scale-105 hover:rounded-xl hover:bg-[#5f3713] hover:ring-2 hover:ring-[#f7f7f7]"
                onClick={() => navigate(AUTH_ROUTES.register)}
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
