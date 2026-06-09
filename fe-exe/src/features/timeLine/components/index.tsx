import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { timelineApi } from "../api/timeline-api";
import type { Timeline } from "../types";
import { resolveImageUrl } from "@/lib/images";
import { Lightbulb, Sparkles, Sparkle, X } from "lucide-react";

function formatFunFact(text: string) {
  const highlights = [
    "Trống đồng Đông Sơn",
    "Thành Cổ Loa",
    "Người Việt",
    "Hai Bà Trưng",
    "Chiến thắng Bạch Đằng năm 938",
    "Kinh thành Thăng Long",
    "Tuyến đường sắt Bắc–Nam đầu tiên",
    "Chữ Quốc ngữ",
    "Ngày 2/9/1945 tại Quảng trường Ba Đình",
    "Đường mòn Hồ Chí Minh"
  ];
  for (const highlight of highlights) {
    if (text.startsWith(highlight)) {
      return (
        <>
          <strong className="text-white font-semibold">{highlight}</strong>
          {text.substring(highlight.length)}
        </>
      );
    }
  }
  return text;
}


export default function PremiumTimeline() {
  const [searchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [showFunfacts, setShowFunfacts] = useState<boolean>(true);

  useEffect(() => {
    timelineApi.getTimelines()
      .then((data) => {
        setTimelines(data);
        const slug = searchParams.get("slug");
        if (slug) {
          const idx = data.findIndex((t) => t.slug === slug);
          if (idx >= 0) setActiveIndex(idx);
        }
        setShowFunfacts(true);
      })
      .catch((error) => console.error("Failed to fetch timelines:", error));
  }, [searchParams]);

  if (timelines.length === 0) {
    return <div className="min-h-[60vh] bg-black" />;
  }

  return (
    <div className="relative w-full min-h-[70vh] md:h-[90vh] bg-black overflow-hidden">
      {/* TIMELINE YEARS */}
      <div className="absolute top-7 left-1/2 z-30 flex -translate-x-1/2 flex-nowrap gap-10">
        {timelines.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              onMouseEnter={() => {
                setActiveIndex(index);
                setShowFunfacts(true);
              }}
              className="relative"
            >
              <span
                className={`whitespace-nowrap text-sm md:text-lg font-semibold tracking-wider transition-all duration-500
                ${isActive
                    ? "text-white"
                    : "text-gray-500"
                  }`}
              >
                {item.displayTime}
              </span>

              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-2 h-[3px] rounded-full transition-all duration-500
                ${isActive ? "w-12 bg-white shadow-[0_0_15px_white]" : "w-0"}`}
              />
            </button>
          );
        })}
      </div>

      {/* SECTIONS */}
      <div className="flex w-full h-full">
        {timelines.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <a
              key={index}
              href={"/course/" + item.slug}
              target="_self"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                setActiveIndex(index);
                setShowFunfacts(true);
              }}
              className={`relative cursor-pointer transition-all duration-700 ease-in-out
              ${isActive ? "flex-[2.3] z-20 overflow-visible" : "flex-1 z-10 overflow-hidden"}`}
            >
              {/* GLOW BORDER */}
              <div
                className={`absolute inset-0 z-30 pointer-events-none transition-all duration-500
                ${
                  isActive
                    ? "border-2 border-white/70 shadow-[0_0_40px_rgba(255,255,255,0.8)]"
                    : "border border-transparent"
                }`}
              />

              {/* IMAGE & OVERLAY CONTAINER (to restrict scale scaling to column boundaries) */}
              <div className="absolute inset-0 overflow-hidden z-0">
                {/* IMAGE */}
                <img
                  src={resolveImageUrl(item.imageUrl)}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-all duration-700
                  ${
                    isActive
                      ? "scale-105 saturate-125 brightness-110 grayscale-0"
                      : "scale-100 grayscale brightness-[0.3]"
                  }`}
                />

                {/* OVERLAY */}
                <div
                  className={`absolute inset-0 transition-all duration-500
                  ${isActive ? "bg-black/20" : "bg-black/60"}`}
                />
              </div>

              {/* FUN FACTS BADGE & POPUP */}
              {isActive && item.funfacts && item.funfacts.length > 0 && (
                <div
                  className="absolute top-1/4 right-8 md:right-12 z-50 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button
                    onClick={() => setShowFunfacts(!showFunfacts)}
                    className="w-14 h-14 rounded-full border-2 border-[#d4a359] bg-[#141414]/90 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,163,89,0.6)] hover:shadow-[0_0_25px_rgba(212,163,89,0.9)] hover:scale-105 transition-all duration-300 group cursor-pointer"
                  >
                    <Lightbulb className="w-5 h-5 text-[#d4a359] fill-[#d4a359]/20 group-hover:fill-[#d4a359]/40 group-hover:scale-110 transition-all duration-300" />
                    <span className="text-white text-base font-semibold">{item.funfacts.length}</span>
                  </button>

                  {showFunfacts && (
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-[320px] md:w-[380px] p-5 rounded-2xl bg-[#141414]/95 border border-[#d4a359]/40 shadow-[0_0_30px_rgba(212,163,89,0.3)] backdrop-blur-md transition-all duration-300 z-50
                      ${index >= 3 ? "right-[70px]" : "left-[70px]"}`}
                    >
                      {/* Arrow */}
                      <div
                        className={`w-3 h-3 bg-[#141414] border-[#d4a359]/40 rotate-45 absolute top-1/2 -translate-y-1/2
                        ${index >= 3 ? "-right-[6px] border-t border-r" : "-left-[6px] border-b border-l"}`}
                      />

                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-white tracking-wide">Fun facts</span>
                          <Sparkles className="w-4 h-4 text-[#d4a359] fill-[#d4a359]/20" />
                        </div>
                        <button
                          onClick={() => setShowFunfacts(false)}
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-4">
                        {item.funfacts.map((fact, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <Sparkle className="w-3.5 h-3.5 text-[#d4a359] fill-[#d4a359]/20 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300 leading-relaxed text-left">
                              {formatFunFact(fact)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONTENT */}
              <div className="absolute bottom-10 left-8 z-40">
                <p
                  className={`mb-3 text-sm tracking-[0.3em] uppercase transition-all duration-500
                  ${isActive ? "text-white/90" : "text-gray-500"}`}
                >
                  {item.displayTime}
                </p>

                <h2
                  className={`font-bold text-white transition-all duration-500 leading-tight
                  ${
                    isActive
                      ? "text-4xl md:text-5xl"
                      : "text-xl md:text-2xl opacity-70"
                  }`}
                >
                  {item.title}
                </h2>

                <div
                  className={`overflow-hidden transition-all duration-700
                  ${
                    isActive ? "max-h-60 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-200 max-w-xs leading-relaxed line-clamp-4">
                    {item.description ||
                      "Click to explore more about this milestone."}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>

);
}
