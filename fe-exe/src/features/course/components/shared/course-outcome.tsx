import { Check } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface CourseOutcomeProps {
    outcomes: string[];
    title?: string;
    className?: string;
    titleClassName?: string;
    itemClassName?: string;
    checkColor?: string;
}

export const CourseOutcome = ({
    outcomes,
    title = "Thông tin thêm về khóa học",
    className = "",
    titleClassName,
    itemClassName,
    checkColor
}: CourseOutcomeProps) => {
    const { isDark } = useTheme();
    const defaultTitleClass = isDark ? "text-[34px] font-title font-bold text-white italic" : "text-[34px] font-title font-bold text-[#5c3a21] italic";
    const defaultItemClass = isDark ? "text-gray-300 font-medium" : "text-gray-700 font-medium";
    const defaultCheckColor = isDark ? "text-white" : "text-[#5c3a21]";

    return (
        <div className={`space-y-12 ${className}`}>
            {title && <h2 className={titleClassName || defaultTitleClass}>{title}</h2>}
            <div className="space-y-4">
                {outcomes.map((text, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <Check size={18} className={checkColor || defaultCheckColor} />
                        <p className={itemClassName || defaultItemClass}>{text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
