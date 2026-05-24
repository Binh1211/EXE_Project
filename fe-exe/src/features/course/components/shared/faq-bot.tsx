import {
    useEffect,
    useState,
} from "react";
import {
    MessageCircle,
    MessageCircleQuestionMark,
} from "lucide-react";

type FAQItem = {
    question: string;
    answer: string;
};

type FAQBotProps = {
    data: FAQItem[];
};

export default function FAQBot({
    data,
}: FAQBotProps) {
    const [selectedIndex, setSelectedIndex] =
        useState<number | null>(null);

    const [displayedText, setDisplayedText] =
        useState("");

    const currentAnswer = selectedIndex !== null
        ? data[selectedIndex]?.answer || ""
        : "Vui lòng chọn một câu hỏi ở danh sách bên trái để tôi có thể giải đáp chi tiết cho bạn nhé.";

    // TYPEWRITER EFFECT
    useEffect(() => {
        let index = 0;

        setDisplayedText("");

        const interval = setInterval(() => {
            setDisplayedText(
                currentAnswer.slice(0, index)
            );

            index++;

            if (index > currentAnswer.length) {
                clearInterval(interval);
            }
        }, 18);

        return () => clearInterval(interval);
    }, [currentAnswer]);

    return (
        <div
            className="w-full max-w-6xl mx-auto
        rounded-[36px]
        border border-white/10
        bg-gradient-to-br from-zinc-950 via-black to-zinc-900
        overflow-hidden
        shadow-[0_0_40px_rgba(0,0,0,0.2)]"
        >
            <div className="bg-white/[0.03] backdrop-blur-2xl w-full h-full flex flex-col">
                {/* HEADER */}
                <div
                    className="relative px-8 md:px-12 py-8
          border-b border-white/10"
                >
                    {/* GLOW */}
                    <div
                        className="absolute top-0 right-0
            w-[250px] h-[250px]
            bg-cyan-500/20 blur-3xl rounded-full"
                    />

                    <div className="relative z-10 flex items-center gap-5">
                        <div
                            className="w-16 h-16 rounded-2xl
              bg-gradient-to-br from-cyan-400 to-blue-600
              flex items-center justify-center
              shadow-[0_0_30px_rgba(34,211,238,0.45)]"
                        >
                            <MessageCircle
                                className="text-white"
                                size={30}
                            />
                        </div>

                        <div>
                            <h1
                                className="text-3xl md:text-4xl
                font-black text-white"
                            >
                                FAQ Assistant
                            </h1>

                            <p className="text-zinc-400 mt-2">
                                Click a question to reveal the answer
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-[340px_1fr]
          h-[450px]"
                >
                    {/* QUESTION LIST */}
                    <div
                        className="border-r border-white/10
            p-5 md:p-6
            bg-white/[0.02]
            overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                    >
                        <div className="flex flex-col gap-4">
                            {data.map((item, index) => {
                                const isActive =
                                    selectedIndex === index;

                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedIndex(index)
                                        }
                                        className={`group relative overflow-hidden
                    rounded-2xl p-5 text-left
                    transition-all duration-500
                    border
                    ${isActive
                                                ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.15)]"
                                                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                                            }`}
                                    >
                                        {/* ACTIVE GLOW */}
                                        {isActive && (
                                            <div
                                                className="absolute inset-0
                        bg-gradient-to-r
                        from-cyan-400/10
                        to-blue-500/10"
                                            />
                                        )}

                                        <div className="relative z-10 flex items-start gap-4">
                                            <div
                                                className={`min-w-10 h-10 rounded-xl
                        flex items-center justify-center
                        transition-all duration-500
                        ${isActive
                                                        ? "bg-cyan-400 text-black"
                                                        : "bg-white/10 text-white"
                                                    }`}
                                            >
                                                <MessageCircleQuestionMark size={18} />
                                            </div>

                                            <div>
                                                <p
                                                    className={`font-semibold transition-all duration-300
                          ${isActive
                                                            ? "text-white"
                                                            : "text-zinc-300"
                                                        }`}
                                                >
                                                    {item.question}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ANSWER PANEL */}
                    <div
                        className="relative
            flex flex-col justify-center
            p-8 md:p-14 overflow-hidden"
                    >
                        {/* BACKGROUND GLOW */}
                        <div
                            className="absolute top-[-80px] right-[-80px]
              w-[250px] h-[250px]
              rounded-full
              bg-cyan-400/10 blur-3xl"
                        />

                        <div className="relative z-10">
                            <h2
                                className="text-3xl md:text-5xl
                font-black text-white
                leading-tight mb-8"
                            >
                                {selectedIndex !== null ? data[selectedIndex]?.question : "Xin chào! Tôi có thể giúp gì cho bạn?"}
                            </h2>

                            <div
                                className="rounded-3xl
                border border-white/10
                bg-white/[0.03]
                p-6 md:p-8
                min-h-[180px]
                max-w-4xl"
                            >
                                <p
                                    className="text-zinc-300
                  text-lg md:text-xl
                  leading-relaxed"
                                >
                                    {displayedText}

                                    <span
                                        className="inline-block ml-1
                    w-[10px] h-[24px]
                    bg-cyan-400 animate-pulse"
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}