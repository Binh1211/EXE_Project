import { BarChart3 } from 'lucide-react';

interface CourseProgressCardProps {
    progressPercentage: number;
    variant?: 'large' | 'small';
}

export const CourseProgressCard = ({
    progressPercentage,
    variant = 'large'
}: CourseProgressCardProps) => {
    const dashArray = 2 * Math.PI * (variant === 'large' ? 64 : 40);
    const dashOffset = dashArray - (dashArray * progressPercentage) / 100;

    if (variant === 'small') {
        return (
            <div className="bg-[#5c3a21] text-white p-8 rounded-[32px] shadow-xl shadow-[#5c3a21]/20">
                <div className="flex items-center gap-4 mb-8">
                    <BarChart3 size={28} />
                    <span className="font-bold text-[22px] font-title">Tiến độ khóa học:</span>
                </div>

                <div className="flex items-center">
                    <div className="flex-grow space-y-3">
                        <div className="pt-2 flex justify-between items-center text-[11px] border-t border-white/10">
                            <span className="text-white/60">Tiến độ hoàn thành:</span>
                            <span className="font-bold whitespace-nowrap">{progressPercentage}%</span>
                        </div>
                    </div>

                    <div className="ml-8 relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="#f59e0b"
                                strokeWidth="10"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 40}
                                strokeDashoffset={2 * Math.PI * 40 - (2 * Math.PI * 40 * progressPercentage) / 100}
                                className="transition-all duration-1000"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-lg font-bold">{progressPercentage}%</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#5c3a21] text-white p-6 rounded-[32px] shadow-2xl shadow-[#5c3a21]/20">
            <div className="flex items-center gap-6 mb-8">
                <BarChart3 size={32} className="text-white/90" />
                <span className="font-bold text-[26px] font-title">Tiến độ khóa học</span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex-[1.5] space-y-4 pr-2">
                    <div className="pb-4 flex justify-between items-center text-[12px] gap-4">
                        <span className="text-white/60 whitespace-nowrap">Tiến độ hoàn thành:</span>
                        <span className="font-bold whitespace-nowrap">{progressPercentage}%</span>
                    </div>
                </div>

                <div className="w-[1px] h-36 bg-white/10"></div>

                <div className="flex-1 flex justify-center pl-10">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="80" cy="80" r="64" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white" />
                            <circle
                                cx="80"
                                cy="80"
                                r="64"
                                stroke="#f59e0b"
                                strokeWidth="16"
                                fill="transparent"
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                className="transition-all duration-1000"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-2xl font-bold">{progressPercentage}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
