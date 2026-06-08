import React, { useState } from "react";
import type { Mindmap as MindmapType } from "../../types";
import { resolveImageUrl } from "@/lib/images";

// Ornate rectangular section frame with vintage styles
const RectFrame: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className="relative mb-2 w-full">
      {/* Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className="inline-flex items-center justify-center px-8 py-3 bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: `url('${resolveImageUrl("/title.png")}')`,
          }}
        >
<span className="text-sm md:text-base font-title font-bold text-[#5c4033] tracking-wide text-center leading-tight px-20">
  {title}
</span>
        </div>
      </div>

      {/* Khung */}
      <div
        className="bg-[#fbf8ee] p-8"
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
      className="w-full min-h-[700px] py-14 px-4 md:px-10 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#5c4033]/30 bg-repeat-y"
      style={{
        backgroundImage: `url('${resolveImageUrl("/bg_mindmap.png")}')`,
        backgroundSize: "100% auto",
      }}
    >
      {/* Warm Retro Map Overlay Wash */}
      <div className="absolute inset-0 bg-[#eadaaf]/10 pointer-events-none" />

      {/* Center vertical connector linking sections */}
      <div aria-hidden className="hidden md:block absolute left-1/2 top-40 bottom-40 -translate-x-1/2 z-0 pointer-events-none">
        <div className="w-[3px] h-full bg-gradient-to-b from-transparent via-[#c9a875]/30 to-transparent mx-auto relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d8b77d] rounded-full" style={{ top: '20%' }} />
          <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d8b77d] rounded-full" style={{ top: '50%' }} />
          <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d8b77d] rounded-full" style={{ top: '80%' }} />
        </div>
      </div>

      {/* Main Mindmap Title Banner */}
      <div className="w-full max-w-2xl mx-auto mb-14 relative z-10">
        {/* Nội dung đặt giữa khung */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-xl md:text-3xl font-title font-bold text-[#5c4033] tracking-wide text-center">
            {mindmap.title}
          </h2>
        </div>
      </div>

      {/* Mindmap Content Layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-1">
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
                    className="w-full max-w-4xl cursor-pointer overflow-hidden rounded-lg drop-shadow-md hover:scale-[1.01] transition-transform duration-200"
                  >
                    <img
                      src={resolveImageUrl(scrollImgUrl)}
                      alt={section.title}
                      className="w-full object-contain"
                    />
                  </div>

                  {/* Decorative flags around the scroll image (only visually) */}
                  {sIdx === 0 && (
                    <>
                      <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="bg-[#fff6e8] border border-[#e2c79a] px-2 py-1 rounded drop-shadow-sm rotate-3">◆</div>
                      </div>
                      <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="bg-[#fff6e8] border border-[#e2c79a] px-2 py-1 rounded drop-shadow-sm -rotate-3">✦</div>
                      </div>
                      <div className="hidden md:block absolute top-3 right-6 z-20">
                        <div className="bg-[#fff]/60 rounded-full p-1 border border-[#e6cfa7]">
                          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#b07a3a]" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Distinct panel design for scroll section content */}
                  <div
                    className={`w-full max-w-4xl mt-4 transition-all duration-300 ${activeTopicKey === scrollKey ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
                  >
                    <div className="bg-gradient-to-r from-[#fffaf0] to-[#fbf3dd] p-6 rounded-lg border border-[#e5cfa8] shadow-inner">
                      {section.topics.map((topic, tIdx) => {
                              const tKey = `${sIdx}-${tIdx}`;
                        const tExpanded =
                          activeScrollTopicKey === tKey ||
                          activeTopicKey === scrollKey;
                        return (
                                <div key={tIdx} className="mb-4 relative">
                                  {/* If we're in section 3 (index 2), show a numbered badge and connector */}
                                  {sIdx === 2 && (
                                    <div className="hidden md:block absolute -left-10 top-2 flex items-center">
                                      <div className="w-8 h-8 rounded-full bg-[#f7e9d2] border border-[#dec79a] flex items-center justify-center text-sm font-semibold text-[#7b4d2a]">{tIdx + 1}</div>
                                      <div className="w-6 h-[2px] bg-[#dec79a] ml-2" />
                                    </div>
                                  )}
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                setActiveScrollTopicKey(
                                  activeScrollTopicKey === tKey ? null : tKey,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  setActiveScrollTopicKey(
                                    activeScrollTopicKey === tKey ? null : tKey,
                                  );
                              }}
                              className="font-title font-bold text-[#5c4033] mb-2 text-base cursor-pointer"
                            >
                              {topic.title}
                            </div>

                            <div
                              className={`${tExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"} transition-all duration-300 overflow-hidden`}
                            >
                              {topic.items.map((item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="text-sm text-gray-700 leading-relaxed mb-2"
                                >
                                  {item.label && (
                                    <div className="font-semibold text-[#5c4033]">
                                      {item.label}
                                    </div>
                                  )}
                                  <div>{item.content}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
          }

          return (
            <RectFrame key={sIdx} title={section.title}>
              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center relative z-10 w-full">
                {/* Horizontal connector line on desktop for 3 topics */}
                {section.topics.length === 3 && (
                  <div className="absolute top-10 left-[15%] right-[15%] h-[1px] bg-[#5c4033]/20 hidden md:block z-0" />
                )}

                {section.topics.map((topic, tIdx) => {
                  return (
                    <div
                      key={tIdx}
                      className={`flex flex-col items-center text-center w-full max-w-[280px] relative z-10
                      ${section.topics.length === 1 ? "md:col-start-2" : ""}`}
                    >
                      {/* Topic Illustration */}
                      {topic.illustrationUrl && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleTopic(sIdx, tIdx)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              toggleTopic(sIdx, tIdx);
                          }}
                          className="h-16 flex items-center justify-center mb-3 hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          <img
                            src={resolveImageUrl(topic.illustrationUrl)}
                            alt={topic.title}
                            className="max-h-full object-contain"
                          />
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
                        className="text-sm md:text-base font-title font-bold text-[#5c4033] mb-4 flex items-center justify-center px-2 whitespace-normal break-words text-center max-w-full cursor-pointer z-10"
                      >
                        {topic.title}
                      </h4>

                      {/* Topic Items: combined panel shown when topic is expanded */}
                      <div
                        id={`topic-content-${sIdx}-${tIdx}`}
                        className={`w-full transition-all duration-300 overflow-hidden ${activeTopicKey === `${sIdx}-${tIdx}` ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="bg-[#fdfcfa] rounded-b-lg shadow-sm border border-[#5c4033]/20">
                          {topic.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="p-3 text-xs md:text-sm text-gray-700 leading-relaxed font-normal border-b last:border-b-0"
                            >
                              {item.label && (
                                <div className="font-semibold text-sm text-[#5c4033] mb-1">
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
