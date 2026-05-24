import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    Star,
    FileText,
    Video,
    User,
    Globe,
    Monitor,
    Calendar,
    PlayCircle,
    Infinity,
    Trophy,
    Play,
    Lock,
    BookOpen,
    Gamepad2
} from 'lucide-react';
import {
    CourseBreadcrumb,
    RelatedCourseCard,
    CourseProgressCard,
} from './shared';
import { IMG } from '@/lib/images';

// Shared components are imported from './shared'

const CourseDetailPage = () => {
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [unlockedChapter, setUnlockedChapter] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const unlocked = parseInt(localStorage.getItem('unlockedChapter') || '0', 10);
        setUnlockedChapter(unlocked);
    }, []);

    const accordionData = [
        {
            title: "Chương 1: Bối cảnh trước chiến tranh",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
            lessons: [
                { name: "Tình hình thế giới sau Thế chiến I", time: "20 phút", type: 'video' as const },
                { name: "Sự trỗi dậy của chủ nghĩa phát xít", time: "18 phút", type: 'book' as const },
                { name: "Minigame kiểm tra", type: "game" as const }
            ]
        },
        {
            title: "Chương 2: Diễn biến chính của chiến tranh",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
            lessons: [
                { name: "Chiến tranh bùng nổ tại Châu Âu", time: "25 phút", type: 'video' as const }
            ]
        },
        {
            title: "Chương 3: Những nhân vật và quốc gia quan trọng",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
            lessons: [
                { name: "Các phe trục", time: "15 phút", type: 'video' as const }
            ]
        },
        {
            title: "Chương 4: Hệ quả của chiến tranh",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
            lessons: [
                { name: "Sự phân chia lại cục diện thế giới", time: "20 phút", type: 'video' as const }
            ]
        },
        {
            title: "Chương 5: Bài học lịch sử từ Chiến tranh thế giới II",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
            lessons: [
                { name: "Tổng kết", time: "10 phút", type: 'video' as const }
            ]
        }
    ];

    const Hero = () => (
        <div className="bg-[#5c3a21] text-white pt-5 pb-16 px-10 relative overflow-hidden">
            {/* Subtle background paper texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <div className="max-w-[1280px] mx-auto relative z-10">
                <CourseBreadcrumb
                    courseTitle="Chiến Tranh Thế Giới II: Nguyên Nhân, Diễn Biến và Hệ Quả"
                    className="mb-4"
                />

                <div className="grid grid-cols-12 gap-12 items-center">
                    {/* Left Side: Content */}
                    <div className="col-span-12 lg:col-span-7">
                        <h1 className="text-[44px] leading-[1.2] font-title font-bold mb-8 italic">
                            Chiến Tranh Thế Giới II: Nguyên Nhân, Diễn Biến và Hệ Quả
                        </h1>

                        <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
                            Khóa học giúp bạn hiểu rõ nguyên nhân dẫn đến Chiến tranh Thế giới II, các sự kiện quan trọng và tác động của
                            cuộc chiến đối với thế giới hiện đại. Thông qua các bài giảng, tài liệu và hình ảnh lịch sử, người học sẽ
                            có cái nhìn toàn diện về một trong những sự kiện quan trọng nhất của thế kỷ 20.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
                            <div className="flex items-center gap-1.5">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < 5 ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="font-bold">5.0</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 pt-5 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-white/60" />
                                <span>12 tài liệu</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Video size={18} className="text-white/60" />
                                <span>18 video</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <User size={18} className="text-white/60" />
                                <span>Thầy Nguyễn Minh</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-white/60" />
                                <span>Ngôn ngữ: Tiếng Việt</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Monitor size={18} className="text-white/60" />
                                <span>Học online 100%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-white/60" />
                                <span>Hoàn thành trong 1 tuần</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Video Preview Card */}
                    <div className="col-span-12 lg:col-span-5 relative mt-8 lg:mt-0 pr-4">
                        <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-black/40 aspect-[4/3]">
                            <img
                                src={IMG.news1}
                                alt="Course Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Overlapping Play Button */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                            <a href={`/course/ww2/learning`}>
                                <div className="w-24 h-24 rounded-full bg-[#fdf2e9] shadow-2xl flex items-center justify-center text-[#5c3a21] border-8 border-[#5c3a21] hover:scale-110 transition-transform cursor-pointer group">
                                    <Play size={32} fill="currentColor" className="ml-1.5 group-hover:scale-110 transition-transform" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen font-sans overflow-x-hidden">
            {/* Dark Paper Pattern Texture Base */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-cover"
                style={{ backgroundImage: `url(${IMG.paperTexture})` }}></div>

            <div className="relative z-10">
                <Hero />
                {/* MAIN CONTENT */}
                <div className="w-full relative z-10">
                    {/* COURSE CONTENT */}
                    <div className="w-full px-8 md:px-12 pt-14">
                        {/* HEADER */}
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-[42px] font-serif font-bold text-gray-800 mb-4 italic">
                                    Nội dung khóa học
                                </h2>

                                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-[0.3em]">
                                    5 chương • 15 bài giảng
                                </p>
                            </div>
                        </div>

                        {/* HORIZONTAL TIMELINE CHAPTERS */}
                        <div className="relative w-full h-[600px] overflow-hidden rounded-[40px] bg-black shadow-2xl">
                            <div className="flex w-full h-full">
                                {accordionData.map((item, index) => {
                                    const isLocked = index > unlockedChapter;
                                    const isActive =
                                        activeAccordion === index &&
                                        !isLocked;

                                    return (
                                        <div
                                            key={index}
                                            onMouseEnter={() => {
                                                if (!isLocked) {
                                                    setActiveAccordion(index);
                                                }
                                            }}
                                            className={`relative overflow-hidden cursor-pointer transition-all duration-700 ease-in-out
                            ${isActive
                                                    ? "flex-[2.7]"
                                                    : "flex-1"
                                                }`}
                                            onClick={() => {
                                                if (!isLocked) {
                                                    navigate(`/course/ww2/learning?lesson=${encodeURIComponent(
                                                        item.lessons[0].name
                                                    )}`);
                                                }
                                            }}
                                        >

                                            {/* IMAGE */}
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
                                ${isActive
                                                        ? "scale-105 saturate-125 brightness-110 grayscale-0"
                                                        : isLocked
                                                            ? "grayscale brightness-[0.25]"
                                                            : "grayscale brightness-[0.45]"
                                                    }`}
                                            />

                                            {/* OVERLAY */}
                                            <div
                                                className={`absolute inset-0 transition-all duration-500
                                ${isActive
                                                        ? "bg-black/20"
                                                        : "bg-black/55"
                                                    }`}
                                            />

                                            {/* ACTIVE GLOW */}
                                            <div
                                                className={`absolute inset-0 z-20 transition-all duration-500
                                ${isActive
                                                        ? "border-2 border-white/60 shadow-[0_0_60px_rgba(255,255,255,0.25)]"
                                                        : "border border-transparent"
                                                    }`}
                                            />

                                            {/* LOCK */}
                                            {isLocked && (
                                                <div
                                                    className="absolute z-40
                                    top-1/2 left-1/2
                                    -translate-x-1/2 -translate-y-1/2
                                    flex flex-col items-center gap-4"
                                                >
                                                    <Lock
                                                        size={42}
                                                        className="text-white/60"
                                                    />

                                                    <p
                                                        className="text-white/60
                                        text-xs md:text-sm
                                        uppercase tracking-[0.25em]
                                        text-center"
                                                    >
                                                        Locked
                                                    </p>
                                                </div>
                                            )}

                                            {/* CONTENT */}
                                            <div
                                                className="absolute inset-0 z-30
                                flex flex-col justify-end
                                p-5 md:p-8"
                                            >
                                                {/* NUMBER */}
                                                <div
                                                    className={`mb-5 transition-all duration-500
                                    ${isActive
                                                            ? "opacity-100"
                                                            : "opacity-50"
                                                        }`}
                                                >
                                                    <span
                                                        className="text-white/60
                                        text-sm tracking-[0.4em]"
                                                    >
                                                        CHAPTER {index + 1}
                                                    </span>
                                                </div>

                                                {/* TITLE */}
                                                <h2
                                                    className={`font-bold text-white leading-tight transition-all duration-500 font-serif
                                    ${isActive
                                                            ? "text-4xl md:text-5xl"
                                                            : "text-xl md:text-2xl"
                                                        }`}
                                                >
                                                    {item.title}
                                                </h2>

                                                {/* LESSONS */}
                                                <div
                                                    className={`overflow-hidden transition-all duration-700
                                    ${isActive
                                                            ? "max-h-[400px] opacity-100 mt-8"
                                                            : "max-h-0 opacity-0"
                                                        }`}
                                                >
                                                    <div
                                                        className="space-y-3
                                        bg-black/40 backdrop-blur-xl
                                        border border-white/10
                                        rounded-2xl
                                        p-5"
                                                    >
                                                        {item.lessons.map(
                                                            (
                                                                lesson,
                                                                lIndex
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        lIndex
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();

                                                                        navigate(
                                                                            `/course/ww2/learning?lesson=${encodeURIComponent(
                                                                                lesson.name
                                                                            )}`
                                                                        );
                                                                    }}
                                                                    className="group flex items-center justify-between
                                                    p-4 rounded-xl
                                                    bg-white/[0.03]
                                                    hover:bg-white/[0.08]
                                                    transition-all duration-300
                                                    cursor-pointer"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div
                                                                            className="w-10 h-10 rounded-xl
                                                            bg-white/10
                                                            flex items-center justify-center"
                                                                        >
                                                                            {lesson.type ===
                                                                                "book" ? (
                                                                                <BookOpen
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                    className="text-white"
                                                                                />
                                                                            ) : lesson.type ===
                                                                                "game" ? (
                                                                                <Gamepad2
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                    className="text-white"
                                                                                />
                                                                            ) : (
                                                                                <PlayCircle
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                    className="text-white"
                                                                                />
                                                                            )}
                                                                        </div>

                                                                        <div>
                                                                            <p
                                                                                className="text-white font-medium
                                                                group-hover:underline"
                                                                            >
                                                                                {
                                                                                    lesson.name
                                                                                }
                                                                            </p>

                                                                            {lesson.time && (
                                                                                <p className="text-white/50 text-sm mt-1">
                                                                                    {
                                                                                        lesson.time
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR MOVED DOWN */}
                    <div className="max-w-[1280px] mx-auto px-8 md:px-12 pt-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* MAIN SIDEBAR CARD */}
                            <div className="bg-white rounded-[32px] shadow-2xl shadow-black/5 overflow-hidden border border-black/5">
                                <div className="p-8">
                                    <div className="grid grid-cols-2 gap-y-10 mb-6">
                                        <div className="flex items-center gap-4">
                                            <PlayCircle
                                                size={22}
                                                className="text-[#d97706]/80"
                                            />
                                            <span className="text-[14px] font-bold text-gray-700">
                                                Khóa học online
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Trophy
                                                size={22}
                                                className="text-[#059669]/80"
                                            />
                                            <span className="text-[14px] font-bold text-gray-700">
                                                Chứng chỉ
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Infinity
                                                size={24}
                                                className="text-[#7c3aed]/80"
                                            />
                                            <span className="text-[14px] font-bold text-gray-700">
                                                Trọn đời
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-black/5">
                                        <h4 className="font-serif font-bold text-gray-800 text-lg mb-4">
                                            Vistory Academy
                                        </h4>

                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Nền tảng học lịch sử trực tuyến...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PROGRESS CARD */}
                            <CourseProgressCard
                                progressPercentage={50}
                                variant="large"
                            />
                        </div>
                    </div>
                </div>

                {/* Related Courses Section - 100% Width */}
                <div className="pt-16 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10"></div>

                    <div className="max-w-[1280px] mx-auto px-10 relative z-10">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-[40px] font-serif font-bold text-[#5c3a21] mb-2 italic">Khóa học liên quan</h2>
                                <p className="text-[#a88d7a] font-medium text-lg">Khám phá thêm những kiến thức lịch sử hấp dẫn khác</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <RelatedCourseCard
                                image={IMG.news1}
                                title="Lịch Sử Việt Nam Qua Các Thời Kỳ"
                                rating="5.0"
                                description="Tìm hiểu hành trình phát triển của Việt Nam từ thời kỳ dựng nước qua các triều đại lịch sử."
                            />
                            <RelatedCourseCard
                                image={IMG.news2}
                                title="Những Cuộc Chiến Tranh Lớn Trong Lịch Sử"
                                rating="5.0"
                                description="Phân tích nguyên nhân, diễn biến và kết quả của các cuộc chiến lớn thay đổi lịch sử thế giới."
                            />
                            <RelatedCourseCard
                                image={IMG.news3}
                                title="Các Nền Văn Minh Cổ Đại"
                                rating="5.0"
                                description="Khám phá các nền văn minh lớn của bộ lạc Ai Cập, Lưỡng Hà, Hy Lạp và La Mã để thấy chúng đã định hình thế giới hiện đại."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
