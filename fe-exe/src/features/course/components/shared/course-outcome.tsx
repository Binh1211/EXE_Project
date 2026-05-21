import { Check } from 'lucide-react';

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
    titleClassName = "text-[34px] font-title font-bold text-[#5c3a21] italic",
    itemClassName = "text-gray-700 font-medium",
    checkColor = "text-[#5c3a21]"
}: CourseOutcomeProps) => (
    <div className={`space-y-12 ${className}`}>
        {title && <h2 className={titleClassName}>{title}</h2>}
        <div className="space-y-4">
            {outcomes.map((text, i) => (
                <div key={i} className="flex gap-4 items-center">
                    <Check size={18} className={checkColor} />
                    <p className={itemClassName}>{text}</p>
                </div>
            ))}
        </div>
    </div>
);
