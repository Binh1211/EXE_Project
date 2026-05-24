import { useEffect, useState } from "react";
import { timelineApi } from "../api/timeline-api";
import type { Timeline } from "../types";

export default function PremiumTimeline() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timelines, setTimelines] = useState<Timeline[]>([]);

  useEffect(() => {
    timelineApi.getTimelines()
      .then((data) => setTimelines(data))
      .catch((error) => console.error("Failed to fetch timelines:", error));
  }, []);

  if (timelines.length === 0) {
    return <div className="h-[90vh] bg-black" />;
  }


  return (
    <div className="relative w-full h-[90vh] bg-black overflow-hidden mb-[-80px]">
      {/* TIMELINE YEARS */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-50 flex gap-10">
        {timelines.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              className="relative"
            >
              <span
                className={`text-sm md:text-lg font-semibold tracking-wider transition-all duration-500
                ${isActive
                    ? "text-white"
                    : "text-gray-500"
                  }`}
              >
                {item.displayTime}
              </span>

              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-2 h-[3px] rounded-full transition-all duration-500
                ${isActive
                    ? "w-12 bg-white shadow-[0_0_15px_white]"
                    : "w-0"
                  }`}
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
              href={"/course"}
              target="_self"
              rel="noopener noreferrer"
              onMouseEnter={() => setActiveIndex(index)}
              className={`relative overflow-hidden cursor-pointer transition-all duration-700 ease-in-out
              ${isActive
                  ? "flex-[2.3]"
                  : "flex-1"
                }`}
            >
              {/* GLOW BORDER */}
              <div
                className={`absolute inset-0 z-30 pointer-events-none transition-all duration-500
                ${isActive
                    ? "border-2 border-white/70 shadow-[0_0_40px_rgba(255,255,255,0.8)]"
                    : "border border-transparent"
                  }`}
              />

              {/* IMAGE */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className={`w-full h-full object-cover transition-all duration-700
                ${isActive
                    ? "scale-105 saturate-125 brightness-110 grayscale-0"
                    : "scale-100 grayscale brightness-[0.3]"
                  }`}
              />

              {/* OVERLAY */}
              <div
                className={`absolute inset-0 transition-all duration-500
                ${isActive
                    ? "bg-black/20"
                    : "bg-black/60"
                  }`}
              />

              {/* CONTENT */}
              <div className="absolute bottom-10 left-8 z-40">
                <p
                  className={`mb-3 text-sm tracking-[0.3em] uppercase transition-all duration-500
                  ${isActive
                      ? "text-white/90"
                      : "text-gray-500"
                    }`}
                >
                  {item.displayTime}
                </p>

                <h2
                  className={`font-bold text-white transition-all duration-500 leading-tight
                  ${isActive
                      ? "text-4xl md:text-5xl"
                      : "text-xl md:text-2xl opacity-70"
                    }`}
                >
                  {item.title}
                </h2>

                <div
                  className={`overflow-hidden transition-all duration-700
                  ${isActive
                      ? "max-h-60 opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-gray-200 max-w-xs leading-relaxed line-clamp-4">
                    {item.description || "Click to explore more about this milestone."}
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