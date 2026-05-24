import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseBreadcrumbProps {
  courseTitle: string;
  chapterTitle?: string;
  timelineSlug?: string;
  className?: string;
}

export const CourseBreadcrumb = ({
  courseTitle,
  chapterTitle,
  timelineSlug,
  className = "",
}: CourseBreadcrumbProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center gap-2 text-white/70 text-[13px] flex-wrap ${className}`}
    >
      <span
        className="cursor-pointer hover:text-white transition-colors"
        onClick={() => navigate("/course")}
      >
        Khóa học
      </span>
      <ChevronRight size={14} className="opacity-50 shrink-0" />
      {timelineSlug ? (
        <>
          <span
            className="cursor-pointer hover:text-white transition-colors truncate max-w-[200px]"
            onClick={() => navigate(`/course/${timelineSlug}`)}
          >
            {courseTitle}
          </span>
          {chapterTitle && (
            <>
              <ChevronRight size={14} className="opacity-50 shrink-0" />
              <span className="text-white font-medium truncate max-w-[280px]">
                {chapterTitle}
              </span>
            </>
          )}
        </>
      ) : (
        <span className="text-white font-medium truncate max-w-[400px]">
          {courseTitle}
        </span>
      )}
    </div>
  );
};
