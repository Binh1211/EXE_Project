import React, { useState } from "react";
import type { Mindmap as MindmapType } from "../../types";
import { resolveImageUrl } from "@/lib/images";

// Ornate rectangular section frame with vintage styles
const RectFrame: React.FC<{
  title: string;
  children: React.ReactNode;
  smallTitle?: boolean;
}> = ({ title, children, smallTitle = false }) => {
  return (
    <div className="relative mb-2 w-full">
      {/* Header placed above the frame to avoid overlap on small screens */}
      <div className="flex justify-center mb-2">
        <div
          className="relative flex items-center justify-center max-w-2xl mx-auto px-10 py-3"
          style={{
            backgroundImage: `url('${resolveImageUrl("/title.png")}')`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span className={`${smallTitle ? "text-xs md:text-sm" : "text-sm md:text-base"} font-title font-bold text-[#5c4033] tracking-wide text-center leading-snug whitespace-normal break-words`}>{title}</span>
        </div>
      </div>

      {/* Khung */}
      <div
        className="bg-[#fbf8ee] p-4 md:p-6"
        style={{
          border: "24px solid transparent",
          borderImage: `url('${resolveImageUrl("/frame.png")}') 24 stretch`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default function Mindmap({ mindmap }: { mindmap: MindmapType }) {
  // Store active expanded topic in key format: "sectionIndex-topicIndex"
  const [activeTopicKey, setActiveTopicKey] = useState<string | null>(null);
  // For scroll-layout sections, track which topic inside the scroll panel is expanded
  const [activeScrollTopicKey, setActiveScrollTopicKey] = useState<
    string | null
  >(null);

  const toggleTopic = (sectionIdx: number, topicIdx: number) => {
    const key = `${sectionIdx}-${topicIdx}`;
    setActiveTopicKey(activeTopicKey === key ? null : key);
  };

  return (
    <div
      className="w-full md:min-h-[400px] min-h-[300px] py-6 md:py-8 px-4 md:px-6 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#5c4033]/30 bg-repeat-y"
      style={{
        backgroundImage: `url('${resolveImageUrl("/bg_mindmap.png")}')`,
        backgroundSize: "100% auto",
      }}
    >
      {/* Warm Retro Map Overlay Wash */}
      <div className="absolute inset-0 bg-[#eadaaf]/10 pointer-events-none" />

      {/* Center vertical connector linking sections */}
      <div
        aria-hidden
        className="hidden md:block absolute left-1/2 top-40 bottom-40 -translate-x-1/2 z-0 pointer-events-none"
      >
        <div
          className="w-[6px] h-full rounded-full"
          style={{
            background:
              "repeating-linear-gradient(to bottom,#caa36a 0,#caa36a 12px,#e7d3ac 12px,#e7d3ac 24px)",
          }}
        >
          {" "}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d8b77d] rounded-full"
            style={{ top: "20%" }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d8b77d] rounded-full"
            style={{ top: "50%" }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d8b77d] rounded-full"
            style={{ top: "80%" }}
          />
        </div>
      </div>

      {/* Main Mindmap Title Banner */}
      <div className="w-full max-w-4xl mx-auto mb-4 md:mb-6 relative z-10 px-2 md:px-0">
        {/* Nội dung đặt giữa khung */}
        <div className="flex items-center justify-center py-2 md:py-3">
          <h2 className="text-lg md:text-3xl font-title font-bold text-[#5c4033] tracking-wide text-center">
            {mindmap.title}
          </h2>
        </div>
      </div>

      {/* Mindmap Content Layout */}
      <div className="relative z-10 w-full max-w-full md:max-w-7xl mx-auto flex flex-col items-center gap-4 md:gap-5 px-2 md:px-4">
        {mindmap.sections.map((section, sIdx) => {
          // If layoutType is scroll and we have an image, render a clickable image
          // that toggles a distinct styled panel with the section's topics/items
          if (section.layoutType === "scroll") {
            const scrollImgUrl = section.topics[0]?.illustrationUrl;
            if (scrollImgUrl) {
              const scrollKey = `scroll-${sIdx}`;
              return (
                <div
                  key={sIdx}
                  className="w-full flex flex-col items-center z-10 my-4 select-none"
                >
                  <div className="relative w-full p-4 md:p-6 rounded-[30px] overflow-hidden">
                    {/* Nền giấy cổ */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom,#f8eed7,#f3e2bd)",
                      }}
                    />

                    {/* Texture giấy */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(#c49a6c 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />

                    {/* Hoa văn góc */}
                    <div className="absolute top-3 left-3 text-[#c7a26b] text-3xl opacity-40">
                      ❦
                    </div>

                    <div className="absolute top-3 right-3 text-[#c7a26b] text-3xl rotate-90 opacity-40">
                      ❦
                    </div>

                    <div className="absolute bottom-3 left-3 text-[#c7a26b] text-3xl -rotate-90 opacity-40">
                      ❦
                    </div>

                    <div className="absolute bottom-3 right-3 text-[#c7a26b] text-3xl rotate-180 opacity-40">
                      ❦
                    </div>

                    {/* Khung chính */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setActiveTopicKey(
                          activeTopicKey === scrollKey ? null : scrollKey,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setActiveTopicKey(
                            activeTopicKey === scrollKey ? null : scrollKey,
                          );
                      }}
                      className="
      relative
      z-10
      cursor-pointer
      transition-all
      duration-300
      hover:scale-[1.01]
    "
                    >
                      {/* Viền cổ */}
                      <div
                        className="
        rounded-[20px]
        border-[5px]
        border-[#d2b48c]
        p-3
        bg-[#fff8e8]
        shadow-[0_10px_40px_rgba(0,0,0,0.15)]
      "
                      >
                        <img
                          src={resolveImageUrl(scrollImgUrl)}
                          alt={section.title}
                          className="w-full rounded-xl object-contain"
                        />
                        <div
                          className={`
                          overflow-hidden
                          transition-all
                          duration-500
                          ${
                            activeTopicKey === scrollKey
                              ? "max-h-[3000px] opacity-100"
                              : "max-h-0 opacity-0"
                          }
                        `}
                        >
                          <div
                            className="
                      relative
                      mt-4
                      rounded-2xl
                      border-2
                      border-[#d2b48c]
                      bg-[#fff8e8]
                      p-6
                      shadow-inner
                    "
                          >
                            {/* Texture giấy */}
                            <div
                              className="absolute inset-0 opacity-10"
                              style={{
                                backgroundImage:
                                  "radial-gradient(#c49a6c 1px, transparent 1px)",
                                backgroundSize: "18px 18px",
                              }}
                            />

                            {section.topics.map((topic, tIdx) => {
                              const tKey = `${sIdx}-${tIdx}`;

                              return (
                                <div
                                  key={tIdx}
                                  className="
            relative
            z-10
            mb-8
            pb-6
            border-b
            border-[#d2b48c]
            last:border-b-0
          "
                                >
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                      setActiveScrollTopicKey(
                                        activeScrollTopicKey === tKey
                                          ? null
                                          : tKey,
                                      )
                                    }
                                    className="
              text-lg
              font-bold
              text-[#5c4033]
              cursor-pointer
              mb-3
            "
                                  >
                                    {topic.title}
                                  </div>

                                  <div
                                    className={`
              overflow-hidden
              transition-all
              duration-300
              ${
                activeScrollTopicKey === tKey || activeTopicKey === scrollKey
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
                                  >
                                    {topic.items.map((item, iIdx) => (
                                      <div
                                        key={iIdx}
                                        className="
                  bg-[#fffdf8]
                  border
                  border-[#e4d0ab]
                  rounded-xl
                  p-4
                  mb-3
                "
                                      >
                                        {item.label && (
                                          <div
                                            className="
                      inline-block
                      px-3
                      py-1
                      mb-2
                      rounded-full
                      bg-[#ead5ac]
                      text-[#5c4033]
                      text-xs
                      font-semibold
                    "
                                          >
                                            {item.label}
                                          </div>
                                        )}

                                        <div className="text-[#4d392d]">
                                          {item.content}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative flags around the scroll image (only visually) */}
                  {sIdx === 0 && (
                    <>
                      <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="bg-[#fff6e8] border border-[#e2c79a] px-2 py-1 rounded drop-shadow-sm rotate-3">
                          ◆
                        </div>
                      </div>
                      <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="bg-[#fff6e8] border border-[#e2c79a] px-2 py-1 rounded drop-shadow-sm -rotate-3">
                          ✦
                        </div>
                      </div>
                      <div className="hidden md:block absolute top-3 right-6 z-20">
                        <div className="bg-[#fff]/60 rounded-full p-1 border border-[#e6cfa7]">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 text-[#b07a3a]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Distinct panel design for scroll section content */}
                </div>
              );
            }
          }

          return (
            <RectFrame key={sIdx} title={section.title} smallTitle={sIdx === 2}>
              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 justify-items-stretch relative z-10 w-full">
                {/* Horizontal connector line on desktop for 3 topics */}
                {section.topics.length === 3 && (
                  <div className="absolute top-10 left-[15%] right-[15%] h-[1px] bg-[#5c4033]/20 hidden md:block z-0" />
                )}

                {section.topics.map((topic, tIdx) => {
                  return (
                    <div
                      key={tIdx}
                      className={`flex flex-col items-center text-center w-full relative z-10
                      ${section.topics.length === 1 ? "md:col-start-2 max-w-md mx-auto" : ""}`}
                    >
                      {/* Topic Illustration */}
                      {topic.illustrationUrl && (
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleTopic(sIdx, tIdx)}
                            className="relative w-16 h-16 md:w-[90px] md:h-[90px] mb-2 cursor-pointer transition-all duration-300 hover:scale-105 group"
                          >
                          {/* Viền ngoài */}
                          <div
                            className="
      absolute
      inset-0
      rounded-full
      bg-gradient-to-br
      from-[#f7ead3]
      to-[#d9b17c]
      p-[6px]
      shadow-xl
      border-2
      border-[#b88955]
    "
                          >
                            {/* Vòng trang trí */}
                            <div
                              className="
        absolute
        inset-2
        rounded-full
        border-2
        border-dashed
        border-[#8b5e3c]/40
      "
                            />
                          </div>

                          {/* Ảnh */}
                          <div
                            className="
      absolute
      inset-[12px]
      rounded-full
      overflow-hidden
      z-10
      bg-[#f9f1de]
    "
                          >
                            <img
                              src={resolveImageUrl(topic.illustrationUrl)}
                              alt={topic.title}
                              className="
        w-full
        h-full
        object-cover
      "
                            />
                          </div>
                        </div>
                      )}

                      {/* Topic Title (clickable to toggle whole topic content) */}
                      <h4
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleTopic(sIdx, tIdx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            toggleTopic(sIdx, tIdx);
                        }}
                        className={`text-xs md:text-sm font-title font-bold text-[#5c4033] mb-2 flex items-center justify-center px-2 whitespace-normal break-words text-center max-w-full cursor-pointer z-10`}
                      >
                        {topic.title}
                      </h4>

                      {/* Topic Items: combined panel shown when topic is expanded */}
                      <div
                        id={`topic-content-${sIdx}-${tIdx}`}
                        className={`w-full transition-all duration-300 overflow-hidden ${
                          activeTopicKey === `${sIdx}-${tIdx}`
                            ? `
      max-h-[800px]
      opacity-100
      rounded-xl
      border-[3px]
      border-[#c8a978]
      bg-[#fffaf0]
      shadow-[0_0_25px_rgba(196,154,108,0.45)]
    `
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div
                          className="
      relative
      overflow-hidden
      rounded-xl
      border-2
      border-[#d2b48c]
      bg-[#fff8e8]
      shadow-lg
    "
                        >
                          {/* Họa tiết giấy cổ */}
                          <div
                            className="
        absolute
        inset-0
        opacity-20
        pointer-events-none
      "
                            style={{
                              backgroundImage:
                                "radial-gradient(#c49a6c 1px, transparent 1px)",
                              backgroundSize: "18px 18px",
                            }}
                          />

                          {topic.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="
          relative
          z-10
          p-4
          text-sm
          text-[#4d392d]
          leading-relaxed
          border-b
          border-[#d8c4a1]
          last:border-b-0
        "
                            >
                              {item.label && (
                                <div
                                  className="
              inline-block
              px-3
              py-1
              mb-2
              rounded-full
              bg-[#e8d2a7]
              text-[#5c4033]
              font-semibold
              text-xs
            "
                                >
                                  {item.label}
                                </div>
                              )}

                              <div>{item.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RectFrame>
          );
        })}
      </div>
    </div>
  );
}
