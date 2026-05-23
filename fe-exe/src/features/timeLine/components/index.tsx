import { useState } from "react";

const timelineData = [
  {
    year: "2018",
    title: "Foundation",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    link: "/course",
  },
  {
    year: "2019",
    title: "First Product",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    link: "/course",
  },
  {
    year: "2020",
    title: "Expansion",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    link: "/course",
  },
  {
    year: "2021",
    title: "Innovation",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    link: "/course",
  },
  {
    year: "2022",
    title: "Future Vision",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    link: "/course",
  },
];

export default function PremiumTimeline() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="relative w-full h-[90vh] bg-black overflow-hidden mb-[-80px]">
      {/* TIMELINE YEARS */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-50 flex gap-10">
        {timelineData.map((item, index) => {
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
                {item.year}
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
        {timelineData.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <a
              key={index}
              href={item.link}
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
                src={item.image}
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
                  {item.year}
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
                      ? "max-h-40 opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-gray-200 max-w-xs leading-relaxed">
                    Click to explore more about this milestone.
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