import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Star,
    Clock,
    FileText,
    Video,
    User,
    Globe,
    Monitor,
    Calendar,
    PlayCircle,
    Infinity,
    Trophy,
    Play
} from 'lucide-react';
import {
    CourseBreadcrumb,
    CourseAccordionItem,
    RelatedCourseCard,
    CourseProgressCard,
    CourseOutcome
} from './shared';

// Shared components are imported from './shared'

const CourseDetailPage = () => {
    const [activeAccordion, setActiveAccordion] = useState(0);
    const navigate = useNavigate();

    const accordionData = [
        {
            title: "Chương 1: Bối cảnh trước chiến tranh",
            lessons: [
                { name: "Tình hình thế giới sau Thế chiến I", time: "20 phút", type: 'video' as const },
                { name: "Sự trỗi dậy của chủ nghĩa phát xít", time: "18 phút", type: 'book' as const },
                { name: "Minigame kiểm tra", type: "game" as const }
            ]
        },
        {
            title: "Chương 2: Diễn biến chính của chiến tranh",
            lessons: [
                { name: "Chiến tranh bùng nổ tại Châu Âu", time: "25 phút", type: 'video' as const }
            ]
        },
        {
            title: "Chương 3: Những nhân vật và quốc gia quan trọng",
            lessons: [
                { name: "Các phe trục", time: "15 phút", type: 'video' as const }
            ]
        },
        {
            title: "Chương 4: Hệ quả của chiến tranh",
            lessons: [
                { name: "Sự phân chia lại cục diện thế giới", time: "20 phút", type: 'video' as const }
            ]
        },
        {
            title: "Chương 5: Bài học lịch sử từ Chiến tranh thế giới II",
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

                            <div className="flex items-center gap-1.5">
                                <Clock size={16} className="text-white/60" />
                                <span>3 giờ học</span>
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
                                src="/img/news1.png"
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
            <div className="fixed pointer-events-none z-0"
                style={{ backgroundImage: 'url("/img/paper-texture.png")' }}></div>

            <div className="relative z-10">
                <Hero />
                {/* Main Content Grid */}
                <div className="ml-[10%] mx-auto px-10 grid grid-cols-12 gap-10">
                    {/* Left Column - Lesson Content */}
                    <div className="col-span-12 lg:col-span-8 pt-10">
                        {/* Course Content Header */}
                        <div className="flex justify-between items-end mb-8 pl-2">
                            <div>
                                <h2 className="text-[34px] font-serif font-bold text-gray-800 mb-4">Nội dung khóa học</h2>
                                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-widest">
                                    5 chương • 15 bài giảng • Tổng thời lượng: 3 giờ
                                </p>
                            </div>
                            <button className="text-[13px] font-bold text-[#5c3a21] underline underline-offset-[10px] decoration-1 hover:text-[#4a2e1a] transition-all">
                                Xem tất cả
                            </button>
                        </div>

                        <div className="flex flex-col min-h-[620px] mb-12">
                            <div className="space-y-4 mb-8">
                                {accordionData.map((item, index) => (
                                    <CourseAccordionItem
                                        key={index}
                                        {...item}
                                        isActive={activeAccordion === index}
                                        onToggle={() => setActiveAccordion(activeAccordion === index ? -1 : index)}
                                        onLessonSelect={(lesson) => navigate(`/course/ww2/learning?lesson=${encodeURIComponent(lesson.name)}`)}
                                        variant="light"
                                    />
                                ))}
                            </div>

                            <button className="w-full py-5 bg-[#5c3a21] text-white rounded-2xl font-bold text-[15px] hover:bg-[#4a2e1a] transition-all shadow-xl shadow-[#5c3a21]/10 transform active:scale-[0.99] mt-auto">
                                1 Chương tiếp theo
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="col-span-12 lg:col-span-4 relative z-20">
                        <div className="sticky top-10 space-y-10">
                            {/* Main Sidebar Card */}
                            <div className="mt-12 bg-white rounded-[32px] shadow-2xl shadow-black/5 overflow-hidden border border-black/5">
                                <div className="p-8">
                                    <div className="grid grid-cols-2 gap-y-10 mb-6">
                                        <div className="flex items-center gap-4">
                                            <PlayCircle size={22} className="text-[#d97706]/80" />
                                            <span className="text-[14px] font-bold text-gray-700">Khóa học online</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Trophy size={22} className="text-[#059669]/80" />
                                            <span className="text-[14px] font-bold text-gray-700">Chứng chỉ</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Clock size={20} className="text-[#2563eb]/80" />
                                            <span className="text-[14px] font-bold text-gray-700">3 giờ học</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Infinity size={24} className="text-[#7c3aed]/80" />
                                            <span className="text-[14px] font-bold text-gray-700">Trọn đời</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-black/5">
                                        <h4 className="font-serif font-bold text-gray-800 text-lg mb-4">Vistory Academy</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                            Nền tảng học lịch sử trực tuyến giúp sinh viên và người yêu lịch sử hiểu sâu hơn về các sự kiện, nhân vật và nền văn minh đã định hình thế giới.
                                        </p>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="font-bold text-sm">4.8</span>
                                            <span className="text-xs text-gray-400">đánh giá</span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-black/5 text-center">
                                            <div>
                                                <p className="text-sm font-bold">300</p>
                                                <p className="text-[10px] text-gray-400">Học viên</p>
                                            </div>
                                            <div className="border-x border-black/5">
                                                <p className="text-sm font-bold">32</p>
                                                <p className="text-[10px] text-gray-400">Khóa học</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">1321</p>
                                                <p className="text-[10px] text-gray-400">Đánh giá</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Card */}
                            <CourseProgressCard
                                totalDuration="3 giờ"
                                studiedTime="1.5 giờ"
                                completedLessons={6}
                                progressPercentage={50}
                                variant="large"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Info Section - 100% Width Background */}
                <div className="bg-[#FFF6F4] py-16 mt-10">
                    <div className="max-w-[1280px] mx-auto px-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-12">
                                <CourseOutcome
                                    title="Thông tin thêm về khóa học"
                                    outcomes={[
                                        "Hiểu rõ nguyên nhân dẫn đến Chiến tranh Thế giới II.",
                                        "Phân tích các sự kiện và bước ngoặt quan trọng của cuộc chiến.",
                                        "Tìm hiểu vai trò của các quốc gia và lãnh đạo trong chiến tranh.",
                                        "Hiểu được tác động của chiến tranh đối với chính trị và xã hội thế giới.",
                                        "Nhận thức được bài học lịch sử để tránh lặp lại những sai lầm trong tương lai."
                                    ]}
                                    titleClassName="text-[38px] font-title font-bold text-[#5c3a21] leading-tight mb-12"
                                    itemClassName="text-[#6b5a4a] text-[16px] leading-relaxed font-medium"
                                    checkColor="text-[#5c3a21] stroke-[3]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 items-start">
                                <div className="space-y-6">
                                    <img
                                        src="/img/news1.png"
                                        className="rounded-2xl w-full h-[200px] object-cover shadow-xl"
                                        alt="Historical scene 1"
                                    />
                                    <img
                                        src="/img/news2.png"
                                        className="rounded-2xl w-full h-[160px] object-cover shadow-xl"
                                        alt="Historical scene 2"
                                    />
                                </div>
                                <div className="space-y-6 pt-12">
                                    <img
                                        src="/img/news3.png"
                                        className="rounded-2xl w-full h-[140px] object-cover shadow-xl"
                                        alt="Historical scene 3"
                                    />
                                    <img
                                        src="/img/news1.png"
                                        className="rounded-2xl w-full h-[220px] object-cover shadow-xl"
                                        alt="Historical scene 4"
                                    />
                                </div>
                            </div>
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
                                image="/img/news1.png"
                                title="Lịch Sử Việt Nam Qua Các Thời Kỳ"
                                duration="2.5 giờ học"
                                rating="5.0"
                                description="Tìm hiểu hành trình phát triển của Việt Nam từ thời kỳ dựng nước qua các triều đại lịch sử."
                            />
                            <RelatedCourseCard
                                image="/img/news2.png"
                                title="Những Cuộc Chiến Tranh Lớn Trong Lịch Sử"
                                duration="3 giờ học"
                                rating="5.0"
                                description="Phân tích nguyên nhân, diễn biến và kết quả của các cuộc chiến lớn thay đổi lịch sử thế giới."
                            />
                            <RelatedCourseCard
                                image="/img/news3.png"
                                title="Các Nền Văn Minh Cổ Đại"
                                duration="2 giờ học"
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
