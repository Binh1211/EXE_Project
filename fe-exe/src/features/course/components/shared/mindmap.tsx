import React, { useState } from "react";
import type { Mindmap as MindmapType, MindmapSection } from "../../types";
import { resolveImageUrl } from "@/lib/images";

/* ─────────────────────────────────────────────
   Helper: Roman numerals for section headers
───────────────────────────────────────────── */
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/* ─────────────────────────────────────────────
   Section I & III style: Card grid with
   circular illustration + toggle-expand items
───────────────────────────────────────────── */
const GridSection: React.FC<{
  section: MindmapSection;
  sIdx: number;
}> = ({ section, sIdx }) => {
  // Track các topic đang MỞ (mặc định rỗng = tất cả đang ẩn)
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const toggle = (tIdx: number) => {
    const k = `${sIdx}-${tIdx}`;
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  return (
    <section className="relative z-10 mb-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-3 px-8 py-2 rounded-full shadow-sm border border-[#ad3130]/20"
          style={{ background: "#f9e6c5" }}
        >
          <span className="text-[#ad3130] font-bold text-lg">
            {ROMAN[sIdx] ?? sIdx + 1}.
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-[#231a06] tracking-wide">
            {section.title}
          </h2>
        </div>
      </div>

      {/* Topic cards */}
      <div
        className={`grid gap-10 ${
          section.topics.length === 1
            ? "grid-cols-1 max-w-sm mx-auto"
            : section.topics.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
            : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        {/* Horizontal connector for 3-topic rows */}
        {section.topics.length === 3 && (
          <div className="hidden md:block absolute top-[calc(10rem+3rem)] left-[calc(15%+40px)] right-[calc(15%+40px)] h-px bg-[#ad3130]/20 z-0 pointer-events-none" />
        )}

        {section.topics.map((topic, tIdx) => {
          const key = `${sIdx}-${tIdx}`;
          const isOpen = openKeys.has(key); // mặc định ẨN

          return (
            <div key={tIdx} className="flex flex-col items-center text-center relative z-10">
              {/* Number badge + circular illustration */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggle(tIdx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggle(tIdx);
                }}
                className="relative mb-5 cursor-pointer group"
              >
                <div
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 shadow-xl transition-transform duration-500 group-hover:scale-105"
                  style={{ borderColor: "#f9e6c5" }}
                >
                  {topic.illustrationUrl ? (
                    <img
                      src={resolveImageUrl(topic.illustrationUrl)}
                      alt={topic.title}
                      className="w-full h-full object-cover"
                      style={{ filter: "sepia(0.45) contrast(0.9) brightness(1.1)" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f9e6c5] to-[#e8c97a] flex items-center justify-center">
                      <span className="text-4xl font-bold text-[#ad3130]/40">
                        {ROMAN[tIdx] ?? tIdx + 1}
                      </span>
                    </div>
                  )}
                </div>
                {/* Numbered badge */}
                <div
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow"
                  style={{
                    background: "#ad3130",
                    color: "#f9e6c5",
                    borderColor: "#f9e6c5",
                  }}
                >
                  {tIdx + 1}
                </div>
              </div>

              {/* Topic title — click để toggle */}
              <h3
                role="button"
                tabIndex={0}
                onClick={() => toggle(tIdx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggle(tIdx);
                }}
                className="text-lg md:text-xl font-bold text-[#ad3130] mb-3 cursor-pointer flex items-center gap-1 justify-center"
                style={{
                  borderBottom: "2px solid #ad3130",
                  paddingBottom: "6px",
                  display: "inline-flex",
                  marginBottom: "12px",
                }}
              >
                {topic.title}
                <span className="text-sm ml-1 opacity-50">{isOpen ? "▲" : "▼"}</span>
              </h3>

              {/* Tất cả items — hiển thị mặc định, đóng lại khi click */}
              {topic.items.length > 0 && (
                <div
                  className={`w-full overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {topic.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className={`rounded-xl border border-[#d4b896] p-4 text-left text-sm shadow-sm ${
                        iIdx === 0 ? "mb-2" : "mt-2"
                      }`}
                      style={{ background: "linear-gradient(to right, #fdf3e3, #f9e8cb)" }}
                    >
                      {item.label && (
                        <span className="inline-block px-3 py-1 mb-2 rounded-full bg-[#f9e6c5] text-[#5c4033] text-xs font-semibold">
                          {item.label}
                        </span>
                      )}
                      <div className="text-[#4d392d] italic whitespace-pre-line">{item.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   Section II style: Physical Scroll layout —
   big image that expands into topic list
───────────────────────────────────────────── */
const ScrollSection: React.FC<{
  section: MindmapSection;
  sIdx: number;
}> = ({ section, sIdx }) => {
  // false = hiện ảnh, true = hiện nội dung thay thế ảnh
  const [showContent, setShowContent] = useState(false);
  // Track các topic đang BỊ ĐÓNG (mặc định rỗng = tất cả mở)
  const [closedTopics, setClosedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (key: string) => {
    setClosedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const mainImage = section.topics.find((t) => t.illustrationUrl)?.illustrationUrl;

  return (
    <section className="relative z-10 mb-16 px-4 md:px-8">
      {/* Scroll container */}
      <div
        className="relative py-10 px-6 md:px-24"
        style={{
          background: "linear-gradient(to bottom, #f8eed7, #f3e2bd, #f8eed7)",
          borderTop: "2px solid #c9a87c",
          borderBottom: "2px solid #c9a87c",
        }}
      >
        {/* Scroll handles */}
        <div
          className="hidden md:block absolute top-[-18px] bottom-[-18px] left-10 w-12 z-20 rounded-lg border-4 shadow-xl"
          style={{
            background: "linear-gradient(to right,#5d4201,#332300,#5d4201)",
            borderColor: "#f9e6c5",
          }}
        >
          <div
            className="absolute -top-3 -left-2.5 -right-2.5 h-7 rounded-full border-2"
            style={{ background: "#261900", borderColor: "#f9e6c5" }}
          />
          <div
            className="absolute -bottom-3 -left-2.5 -right-2.5 h-7 rounded-full border-2"
            style={{ background: "#261900", borderColor: "#f9e6c5" }}
          />
        </div>
        <div
          className="hidden md:block absolute top-[-18px] bottom-[-18px] right-10 w-12 z-20 rounded-lg border-4 shadow-xl"
          style={{
            background: "linear-gradient(to right,#5d4201,#332300,#5d4201)",
            borderColor: "#f9e6c5",
          }}
        >
          <div
            className="absolute -top-3 -left-2.5 -right-2.5 h-7 rounded-full border-2"
            style={{ background: "#261900", borderColor: "#f9e6c5" }}
          />
          <div
            className="absolute -bottom-3 -left-2.5 -right-2.5 h-7 rounded-full border-2"
            style={{ background: "#261900", borderColor: "#f9e6c5" }}
          />
        </div>

        {/* Section header */}
        <div className="text-center mb-8 relative -mt-3">
          <div
            className="inline-flex items-center gap-3 px-10 py-3 rounded-full shadow-lg border-2 border-[#231a06]/30"
            style={{ background: "#f9e6c5" }}
          >
            <span className="text-[#ad3130] font-bold text-lg">
              {ROMAN[sIdx] ?? sIdx + 1}.
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-[#231a06] tracking-wide">
              {section.title}
            </h2>
          </div>
        </div>

        {/* Layout: ảnh bên trái ↔ nội dung khi click */}
        <div className="flex flex-col md:flex-row items-start gap-8 pb-4">

          {/* ── Cột trái: Ảnh HOẶC danh sách topics ── */}
          {mainImage && (
            <div className="md:w-1/2 w-full">
              {/* Ảnh — hiện khi chưa click */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  showContent ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[500px] opacity-100"
                }`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowContent(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setShowContent(true);
                  }}
                  className="cursor-pointer group"
                >
                  <div
                    className="rounded-xl border-4 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ borderColor: "rgba(249,230,197,0.7)" }}
                  >
                    <img
                      src={resolveImageUrl(mainImage)}
                      alt={section.title}
                      className="w-full h-64 md:h-72 object-cover"
                      style={{
                        filter: "sepia(0.45) contrast(0.9) brightness(1.1)",
                        mixBlendMode: "multiply",
                      }}
                    />
                  </div>
                  <p className="text-center text-xs text-[#ad3130]/70 mt-2 italic font-medium">
                    🖱 Nhấn vào ảnh để xem nội dung chi tiết
                  </p>
                </div>
              </div>

              {/* Nội dung topics — hiện khi đã click ảnh */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  showContent ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <div
                  className="rounded-2xl border-2 border-[#c9a05a] p-5 shadow-inner relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #f5ead0 0%, #eddbb5 50%, #f5ead0 100%)" }}
                >
                  {/* Paper texture */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(#c49a6c 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />

                  {/* Nút quay lại ảnh */}
                  <button
                    type="button"
                    onClick={() => setShowContent(false)}
                    className="relative z-10 mb-4 flex items-center gap-1.5 text-xs font-semibold text-[#ad3130]/70 hover:text-[#ad3130] transition-colors"
                  >
                    ← Xem ảnh
                  </button>

                  {section.topics.map((topic, tIdx) => {
                    const tKey = `scroll-${sIdx}-${tIdx}`;
                    const tIsOpen = !closedTopics.has(tKey);

                    return (
                      <div
                        key={tIdx}
                        className="relative z-10 mb-6 pb-5 border-b border-[#d2b48c] last:border-b-0"
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleTopic(tKey)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") toggleTopic(tKey);
                          }}
                          className="text-base font-bold text-[#5c4033] cursor-pointer mb-3 flex items-center gap-2"
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: "#ad3130", color: "#f9e6c5" }}
                          >
                            {tIdx + 1}
                          </span>
                          {topic.title}
                          <span className="ml-auto text-sm text-[#ad3130]/50">
                            {tIsOpen ? "▲" : "▼"}
                          </span>
                        </div>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            tIsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          {topic.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="rounded-xl border border-[#c9a05a]/50 p-3 mb-2 shadow-sm text-sm"
                              style={{ background: "linear-gradient(to right, #fdf3e3, #f9e8cb)" }}
                            >
                              {item.label && (
                                <div className="inline-block px-2.5 py-0.5 mb-1.5 rounded-full bg-[#ead5ac] text-[#5c4033] text-xs font-semibold">
                                  {item.label}
                                </div>
                              )}
                              <div className="text-[#4d392d] whitespace-pre-line">{item.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Cột phải: Text preview (luôn hiển thị) ── */}
          <div className={mainImage ? "md:w-1/2 w-full" : "w-full"}>
            {section.topics[0] && (
              <>
                {section.topics[0].items[0] && (
                  <p className="text-lg md:text-xl italic text-[#231a06] leading-loose mb-5 whitespace-pre-line">
                    <span
                      className="float-left font-bold mr-2 leading-none"
                      style={{ fontSize: "3rem", color: "#ad3130", lineHeight: 0.85 }}
                    >
                      {section.topics[0].items[0].content.charAt(0)}
                    </span>
                    {section.topics[0].items[0].content.slice(1)}
                  </p>
                )}
                {section.topics[0].items[1] && (
                  <div
                    className="p-5 italic text-[#231a06]/80 text-base clearfix whitespace-pre-line"
                    style={{
                      borderLeft: "4px solid #ad3130",
                      background: "rgba(35,26,6,0.04)",
                    }}
                  >
                    {section.topics[0].items[1].content}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};



/* ─────────────────────────────────────────────
   Main Mindmap Component
───────────────────────────────────────────── */
export default function Mindmap({ mindmap }: { mindmap: MindmapType }) {
  return (
    <div
      className="w-full md:min-h-[400px] min-h-[300px] relative overflow-hidden shadow-2xl rounded-3xl border-2 border-[#5c4033]/30 bg-repeat-y"
      style={{
        backgroundImage: `url('${resolveImageUrl("/bg_mindmap.png")}')`,
        backgroundSize: "100% auto",
      }}
    >
      {/* Trong-dong decorative background circle */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='none' stroke='black' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='35' fill='none' stroke='black' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='black' stroke-width='0.5'/%3E%3Cpath d='M50,2 L50,98 M2,50 L98,50 M15,15 L85,85 M15,85 L85,15' stroke='black' stroke-width='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Inner padding */}
      <div className="relative z-10 px-4 md:px-14 py-10 md:py-14">
        {/* ── Main Title Banner ── */}
        <header className="text-center mb-14">
          <h1 className="text-3xl md:text-5xl font-bold text-[#231a06] mb-4">
            {mindmap.title}
          </h1>
          <div className="flex justify-center items-center gap-5">
            <div className="h-px w-28 md:w-40" style={{ background: "rgba(173,49,48,0.3)" }} />
            <span className="text-[#ad3130] italic font-medium text-sm md:text-base">
              Bản đồ họa thuật lại dòng chảy lịch sử dân tộc
            </span>
            <div className="h-px w-28 md:w-40" style={{ background: "rgba(173,49,48,0.3)" }} />
          </div>
        </header>

        {/* ── Vertical center connector (desktop) ── */}
        <div
          aria-hidden
          className="hidden md:block absolute left-1/2 top-52 bottom-32 -translate-x-1/2 z-0 pointer-events-none"
        >
          <div
            className="w-1.5 h-full rounded-full"
            style={{
              background:
                "repeating-linear-gradient(to bottom,#caa36a 0,#caa36a 12px,#e7d3ac 12px,#e7d3ac 24px)",
            }}
          >
            {[20, 50, 80].map((pct) => (
              <div
                key={pct}
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                style={{ top: `${pct}%`, background: "#d8b77d" }}
              />
            ))}
          </div>
        </div>

        {/* ── Render Sections ── */}
        {mindmap.sections.map((section, sIdx) =>
          section.layoutType === "scroll" ? (
            <ScrollSection key={sIdx} section={section} sIdx={sIdx} />
          ) : (
            <GridSection key={sIdx} section={section} sIdx={sIdx} />
          )
        )}

        {/* ── Footer ornament ── */}
        <footer className="text-center pt-10 border-t border-[#ad3130]/10 mt-4">
          <div className="flex justify-center items-center gap-4 opacity-40">
            <span className="text-2xl">⛩</span>
            <p className="text-lg font-bold text-[#231a06]">Đại Nam Lục</p>
            <span className="text-2xl">⛩</span>
          </div>
          <p className="text-xs tracking-[0.25em] font-bold text-[#231a06]/30 mt-2 uppercase">
            Bảo tồn hồn cốt dân tộc
          </p>
        </footer>
      </div>
    </div>
  );
}
