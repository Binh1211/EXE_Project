import { ChevronDown, BookOpen, Gamepad2, Lock } from 'lucide-react';

interface Lesson {
    name: string;
    time?: string;
    type?: 'video' | 'book' | 'game';
}

interface CourseAccordionItemProps {
    title: string;
    lessons: Lesson[];
    isActive: boolean;
    onToggle: () => void;
    onLessonSelect?: (lesson: Lesson) => void;
    variant?: 'light' | 'default';
    isLocked?: boolean;
}

export const CourseAccordionItem = ({
    title,
    lessons,
    isActive,
    onToggle,
    onLessonSelect,
    variant = 'light',
    isLocked = false
}: CourseAccordionItemProps) => {
    const handleToggle = () => {
        if (!isLocked) {
            onToggle();
        }
    };
    if (variant === 'default') {
        return (
            <div className="border-b border-[#5c3a21]/10 last:border-0 px-4 py-4">
                <button
                    onClick={handleToggle}
                    className={`w-full flex items-center justify-between py-1.5 text-left group ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    <span className="font-title font-bold text-[16px] text-[#5c3a21] group-hover:opacity-80 transition-all">{title}</span>
                    {isLocked ? (
                        <Lock size={16} className="text-[#5c3a21]/60" />
                    ) : (
                        <ChevronDown size={16} className={`text-[#5c3a21]/40 transition-transform duration-300 ${isActive ? '' : '-rotate-90'}`} />
                    )}
                </button>

                {isActive && (
                    <div className="mt-3 pl-4 space-y-3">
                        {lessons.map((lesson, index) => (
                            <div
                                key={index}
                                onClick={() => onLessonSelect?.(lesson)}
                                className="flex items-center justify-between py-0.5 group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    {lesson.type === 'book' ? (
                                        <BookOpen size={16} className="text-[#5c3a21]/60" />
                                    ) : lesson.type === 'game' ? (
                                        <Gamepad2 size={16} className="text-[#5c3a21]/60" />
                                    ) : (
                                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#5c3a21]/70 border-b-[5px] border-b-transparent ml-0.5"></div>
                                    )}
                                    <span className="text-[14px] font-medium text-[#5c3a21]/80 group-hover:text-[#5c3a21] group-hover:underline underline-offset-4 decoration-1 transition-all">
                                        {lesson.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="border-b border-[#5c3a21]/10 last:border-0 px-4 py-4 bg-white">
            <button
                onClick={handleToggle}
                className={`w-full flex items-center justify-between py-1.5 text-left group ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                <span className="font-title font-bold text-[16px] text-[#5c3a21] group-hover:opacity-80 transition-all">{title}</span>
                {isLocked ? (
                    <Lock size={16} className="text-[#5c3a21]/60" />
                ) : (
                    <ChevronDown size={16} className={`text-[#5c3a21]/40 transition-transform duration-300 ${isActive ? '' : '-rotate-90'}`} />
                )}
            </button>

            {isActive && (
                <div className="mt-3 pl-4 space-y-3 bg-white">
                    {lessons.map((lesson, index) => (
                        <div
                            key={index}
                            onClick={() => onLessonSelect?.(lesson)}
                            className="flex items-center justify-between py-0.5 group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                {lesson.type === 'book' ? (
                                    <BookOpen size={16} className="text-[#5c3a21]/60" />
                                ) : lesson.type === 'game' ? (
                                    <Gamepad2 size={16} className="text-[#5c3a21]/60" />
                                ) : (
                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-[#5c3a21]/70 border-b-[5px] border-b-transparent ml-0.5"></div>
                                )}
                                <span className="text-[14px] font-medium text-[#5c3a21]/80 group-hover:text-[#5c3a21] group-hover:underline underline-offset-4 decoration-1 transition-all">
                                    {lesson.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
