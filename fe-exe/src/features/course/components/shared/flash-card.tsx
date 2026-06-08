import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Minimize2,
} from "lucide-react";

type FlashCardItem = {
  front?: string;
  back?: string;
  year?: string;
  content?: string;
};

type FlashCardsProps = {
  cards: FlashCardItem[];
};

function getFront(card: FlashCardItem) {
  return card.front ?? card.year ?? "";
}

function getBack(card: FlashCardItem) {
  return card.back ?? card.content ?? "";
}

export default function FlashCards({ cards }: FlashCardsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

  const currentCard = cards[currentIndex];
  const frontLabel = getFront(currentCard);
  const backLabel = getBack(currentCard);

    const nextCard = () => {
        setFlipped(false);

        setCurrentIndex((prev) =>
            prev === cards.length - 1 ? 0 : prev + 1
        );
    };

    const prevCard = () => {
        setFlipped(false);

        setCurrentIndex((prev) =>
            prev === 0 ? cards.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFullscreen) return;

            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                setFlipped((prev) => !prev);
            } else if (e.key === 'Escape') {
                setIsFullscreen(false);
            } else if (e.key === 'ArrowRight') {
                nextCard();
            } else if (e.key === 'ArrowLeft') {
                prevCard();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    return (
        <div
            className={`
                bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617]
                flex items-center justify-center p-6 transition-all duration-500
                ${isFullscreen
                    ? "fixed inset-0 z-[100] w-screen h-screen rounded-none"
                    : "relative w-full rounded-3xl overflow-hidden"
                }
            `}
        >
            {/* BACKGROUND GLOW */}
            <div className="absolute w-[700px] h-[700px] rounded-full bg-cyan-500/20 blur-[140px]" />
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-fuchsia-500/20 blur-[140px]" />

            {/* FULLSCREEN BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(!isFullscreen);
                }}
                className="absolute top-6 right-6 z-50
                w-12 h-12 rounded-full
                bg-white/10 backdrop-blur-xl
                border border-white/20
                flex items-center justify-center
                hover:scale-110 hover:bg-white/20
                transition-all duration-300"
            >
                {isFullscreen ? (
                    <Minimize2 className="text-white" size={24} />
                ) : (
                    <Maximize2 className="text-white" size={24} />
                )}
            </button>

            {/* LEFT BUTTON */}
            <button
                onClick={prevCard}
                className="absolute left-6 z-50
        w-14 h-14 rounded-full
        bg-white/10 backdrop-blur-xl
        border border-white/20
        flex items-center justify-center
        hover:scale-110 hover:bg-white/20
        transition-all duration-300"
            >
                <ChevronLeft
                    className="text-white"
                    size={30}
                />
            </button>

            {/* CARD */}
            <div
                className={`[perspective:2000px] w-full max-w-5xl transition-all duration-500 ${isFullscreen ? "h-[75vh] mt-12" : "h-[450px]"
                    }`}
            >
                <div
                    onClick={() => setFlipped(!flipped)}
                    className={`relative w-full h-full cursor-pointer duration-700
          [transform-style:preserve-3d]
          ${flipped
                            ? "[transform:rotateY(180deg)]"
                            : ""
                        }`}
                >
                    {/* FRONT */}
                    <div
                        className="absolute inset-0 rounded-[40px]
            [backface-visibility:hidden]
            overflow-hidden
            bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700
            shadow-[0_0_80px_rgba(59,130,246,0.45)]
            border border-white/20"
                    >
                        {/* DECORATION */}
                        <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-fuchsia-500/30 blur-3xl" />

                        {/* CONTENT */}
                        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-10">

                            <h1
                                className="text-[40px] md:text-[72px]
                font-black text-white leading-tight break-words max-w-[88%] mx-auto"
                            >
                                {frontLabel}
                            </h1>

                            {/* PROGRESS */}
                            <div className="absolute bottom-10 text-white/60">
                                {currentIndex + 1} / {cards.length}
                            </div>
                        </div>
                    </div>

                    {/* BACK */}
                    <div
                        className="absolute inset-0 rounded-[40px]
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
            overflow-hidden
            bg-gradient-to-br from-[#ffffff] to-[#dbeafe]
            border border-white/50
            shadow-[0_0_80px_rgba(255,255,255,0.2)]"
                    >
                        {/* DECOR */}
                        <div className="absolute top-[-80px] right-[-80px] w-[250px] h-[250px] rounded-full bg-cyan-300/40 blur-3xl" />

                        <div className="relative z-20 h-full flex flex-col items-center justify-center gap-6 p-10 md:p-16">

                            <h2
                                className="text-3xl md:text-4xl
                font-black text-zinc-900 text-center break-words max-w-full"
                            >
                                {frontLabel}
                            </h2>

                            <div className="w-full max-w-3xl rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/30">
                                <p
                                    className="text-zinc-700 text-base md:text-lg
                    leading-relaxed whitespace-pre-line text-center"
                                >
                                    {backLabel}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT BUTTON */}
            <button
                onClick={nextCard}
                className="absolute right-6 z-50
        w-14 h-14 rounded-full
        bg-white/10 backdrop-blur-xl
        border border-white/20
        flex items-center justify-center
        hover:scale-110 hover:bg-white/20
        transition-all duration-300"
            >
                <ChevronRight
                    className="text-white"
                    size={30}
                />
            </button>
        </div>
    );
}