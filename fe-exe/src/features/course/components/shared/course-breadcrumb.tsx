import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseBreadcrumbProps {
    courseTitle: string;
    className?: string;
}

export const CourseBreadcrumb = ({ courseTitle, className = '' }: CourseBreadcrumbProps) => {
    const navigate = useNavigate();
    return (
        <div className={`flex items-center gap-2 text-white/70 text-[13px] ${className}`}>
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/course')}>Khóa học</span>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-white font-medium truncate max-w-[400px]">{courseTitle}</span>
        </div>
    );
}
