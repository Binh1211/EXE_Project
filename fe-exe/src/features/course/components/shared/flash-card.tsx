import { useState, useEffect } from "react";
import {
    ChevronRight,
    Maximize2,
    Minimize2,
    RotateCcw,
    Check,
    X
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
    return card?.front ?? card?.year ?? "";
}

function getBack(card: FlashCardItem) {
    return card?.back ?? card?.content ?? "";
}

export default function FlashCards({ cards }: FlashCardsProps) {
    const [activeCards, setActiveCards] = useState<FlashCardItem[]>(cards);
    const [flipped, setFlipped] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        setActiveCards(cards);
        setFlipped(false);
    }, [cards]);

    const handleNext = () => {
        setFlipped(false);
        setTimeout(() => {
            setActiveCards((prev) => {
                if (prev.length <= 1) return prev;
                const newCards = [...prev];
                const card = newCards.shift();
                if (card) newCards.push(card);
                return newCards;
            });
        }, 150);
    };

    const handleRemembered = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFlipped(false);
        setTimeout(() => {
            setActiveCards((prev) => prev.slice(1));
        }, 150);
    };

    const handleNotRemembered = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleNext();
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
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, activeCards.length]);

    if (activeCards.length === 0) {
        return (
            <div className={`
                bg-gradient-to-br from-[#422006] via-[#713f12] to-[#451a03]
                flex flex-col items-center justify-center p-6 transition-all duration-500
                ${isFullscreen ? "fixed inset-0 z-[999] w-screen h-screen rounded-none" : "relative w-full h-[450px] rounded-3xl overflow-hidden"}
            `}>
                <div className="absolute w-[700px] h-[700px] rounded-full bg-yellow-500/20 blur-[140px]" />
                <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-amber-500/20 blur-[140px]" />

                {/* FULLSCREEN BUTTON */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen(!isFullscreen);
                    }}
                    className="absolute top-6 right-6 z-50
                    w-12 h-12 rounded-full
                    bg-white/10 backdrop-blur-xl
                    border-2 border-white/50
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

                <div className="relative z-10 flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center drop-shadow-md">Hoàn thành!</h2>
                    <p className="text-yellow-100 text-lg md:text-xl text-center mb-8 drop-shadow-sm">Bạn đã ôn tập xong tất cả các thẻ.</p>
                    <button
                        onClick={() => {
                            setActiveCards(cards);
                            setFlipped(false);
                        }}
                        className="flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <RotateCcw size={20} />
                        Ôn tập lại
                    </button>
                </div>
            </div>
        );
    }

    const currentCard = activeCards[0];
    const frontLabel = getFront(currentCard);
    const backLabel = getBack(currentCard);

    return (
        <div
            className={`
                bg-gradient-to-br from-[#422006] via-[#713f12] to-[#290f02]
                flex items-center justify-center p-6 transition-all duration-500
                ${isFullscreen
                    ? "fixed inset-0 z-[999] w-screen h-screen rounded-none"
                    : "relative w-full rounded-3xl overflow-hidden"
                }
            `}
        >
            {/* BACKGROUND GLOW */}
            <div className="absolute w-[700px] h-[700px] rounded-full bg-yellow-500/10 blur-[140px]" />
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[140px]" />

            {/* FULLSCREEN BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(!isFullscreen);
                }}
                className={`absolute right-6 top-6 z-50
                w-14 h-14 rounded-full
                bg-yellow-500 hover:bg-yellow-400
                border-2 border-yellow-200
                shadow-[0_0_20px_rgba(234,179,8,0.4)]
                flex items-center justify-center
                hover:scale-110
                transition-all duration-300
                `}
            >
                {isFullscreen ? (
                    <Minimize2 className="text-yellow-950" size={28} />
                ) : (
                    <Maximize2 className="text-yellow-950" size={28} />
                )}
            </button>

            {/* CARD */}
            <div
                className={`[perspective:2000px] w-full max-w-5xl transition-all duration-500 ${isFullscreen ? "h-[75vh] mt-12" : "h-[450px]"
                    }`}
            >
                <div
                    className={`relative w-full h-full duration-700
          [transform-style:preserve-3d]
          ${flipped
                            ? "[transform:rotateY(180deg)]"
                            : ""
                        }`}
                >
                    {/* FRONT */}
                    <div
                        onClick={() => setFlipped(true)}
                        className={`absolute inset-0 rounded-[40px] cursor-pointer
            [backface-visibility:hidden]
            overflow-hidden
            bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600
            shadow-[0_0_80px_rgba(245,158,11,0.3)]
            border border-white/20
            ${flipped ? 'pointer-events-none' : ''}`}
                    >
                        {/* DECORATION */}
                        <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full bg-white/20 blur-3xl" />
                        <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-orange-700/30 blur-3xl" />

                        {/* CONTENT */}
                        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-10">
                            <h1
                                className="text-[40px] md:text-[72px]
                font-black text-white leading-tight break-words max-w-[88%] mx-auto drop-shadow-md"
                            >
                                {frontLabel}
                            </h1>

                            {/* PROGRESS */}
                            <div className="absolute bottom-10 text-white/80 font-medium flex gap-6 bg-black/20 px-6 py-2 rounded-full">
                                <span>Đã thuộc: <span className="font-bold text-green-300">{cards.length - activeCards.length}</span></span>
                                <span>Còn lại: <span className="font-bold text-yellow-300">{activeCards.length}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* BACK */}
                    <div
                        className={`absolute inset-0 rounded-[40px]
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
            overflow-hidden
            bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]
            border border-amber-200/50
            shadow-[0_0_80px_rgba(245,158,11,0.15)]
            ${!flipped ? 'pointer-events-none' : ''}`}
                    >
                        {/* Lớp nền bắt sự kiện click để lật lại */}
                        <div
                            className="absolute inset-0 z-0 cursor-pointer"
                            onClick={() => setFlipped(false)}
                        />

                        {/* DECOR */}
                        <div className="absolute top-[-80px] right-[-80px] w-[250px] h-[250px] rounded-full bg-yellow-300/30 blur-3xl pointer-events-none" />

                        <div className="relative z-20 h-full flex flex-col items-center justify-center gap-6 p-10 md:p-16 pointer-events-none">
                            <h2
                                className="text-3xl md:text-4xl
                font-black text-amber-900 text-center break-words max-w-full"
                            >
                                {frontLabel}
                            </h2>

                            <div
                                onClick={() => setFlipped(false)}
                                className="w-full max-w-3xl rounded-[32px] border border-amber-100 bg-white/90 p-6 shadow-lg shadow-amber-900/5 flex-grow overflow-y-auto pointer-events-auto cursor-pointer"
                            >
                                <p
                                    className="text-amber-950 text-base md:text-lg
                    leading-relaxed whitespace-pre-line text-center"
                                >
                                    {backLabel}
                                </p>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-4 mt-2 pointer-events-auto relative z-50">
                                <button
                                    onClick={handleNotRemembered}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-full transition-all border border-red-200 shadow-sm hover:shadow-md"
                                >
                                    <X size={20} />
                                    Chưa nhớ
                                </button>
                                <button
                                    onClick={handleRemembered}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 font-bold rounded-full transition-all border border-green-200 shadow-sm hover:shadow-md"
                                >
                                    <Check size={20} />
                                    Đã nhớ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                }}
                className="absolute right-6 z-50
        w-14 h-14 rounded-full
        bg-white/10 backdrop-blur-xl
        border border-white/20
        flex items-center justify-center
        hover:scale-110 hover:bg-white/20
        transition-all duration-300"
            >
                <ChevronRight
                    className="text-yellow-100"
                    size={30}
                />
            </button>
        </div>
    );
}