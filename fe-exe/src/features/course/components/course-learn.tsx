import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Star,
    ChevronDown,
    Share2,
    Play,
    Monitor,
    Clock,
    AlarmClock,
    BookOpen,
    Video
} from 'lucide-react';
import {
    CourseBreadcrumb,
    CourseAccordionItem,
    RelatedCourseCard,
    CourseProgressCard,
    CourseOutcome
} from './shared';

// Shared components are imported from './shared'

const CourseLearningPage = () => {
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [activeTab, setActiveTab] = useState('Overview');
    const [searchParams] = useSearchParams();
    const lessonNameFromUrl = searchParams.get('lesson');
    const navigate = useNavigate();

    const accordionData = [
        {
            title: "Chương 1: Bối cảnh trước chiến tranh",
            lessons: [
                { name: "Tình hình thế giới sau Thế chiến I", time: "20 phút", type: 'video' as const, videoId: "NKpMA_gLrdE" },
                { name: "Sự trỗi dậy của chủ nghĩa phát xít", time: "18 phút", type: 'book' as const },
                { name: "Minigame kiểm tra", type: "game" as const }
            ]
        },
        {
            title: "Chương 2: Diễn biến chính của chiến tranh",
            lessons: [
                { name: "Chiến tranh bùng nổ tại Châu Âu", time: "25 phút", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        },
        {
            title: "Chương 3: Những nhân vật và quốc gia quan trọng",
            lessons: [
                { name: "Các phe trục", time: "15 phút", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        },
        {
            title: "Chương 4: Hệ quả của chiến tranh",
            lessons: [
                { name: "Sự phân chia lại cục diện thế giới", time: "20 phút", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        },
        {
            title: "Chương 5: Bài học lịch sử từ Chiến tranh thế giới II",
            lessons: [
                { name: "Tổng kết", time: "10 phút", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        }
    ];

    const [activeLesson, setActiveLesson] = useState<any>(accordionData[0].lessons[0]);

    // Handle deep linking from URL ?lesson=Name
    useEffect(() => {
        if (lessonNameFromUrl) {
            accordionData.forEach((chapter, chapterIndex) => {
                const foundLesson = chapter.lessons.find(l => l.name === lessonNameFromUrl);
                if (foundLesson) {
                    setActiveLesson(foundLesson);
                    setActiveAccordion(chapterIndex);
                }
            });
        }
    }, [lessonNameFromUrl]);

    const DocumentReader = ({ lesson }: { lesson: any }) => (
        <div className="bg-[#FFFDF9] h-full flex flex-col p-16 relative overflow-y-auto">
            <div className="max-w-[700px] mx-auto w-full">
                <h1 className="text-[32px] font-title font-bold text-[#1a1a1a] mb-12 text-center uppercase tracking-tight">
                    {lesson.name}
                </h1>

                <div className="space-y-8 text-[17px] text-[#2c2c2c] leading-[1.8] font-medium text-justify">
                    <p>
                        Chiến tranh Thế giới II bùng nổ trong bối cảnh thế giới vẫn còn nhiều mâu thuẫn chưa được giải quyết sau Chiến tranh thế giới thứ nhất. Hiệp ước Versailles đã gây ra sự bất mãn sâu sắc ở Đức, tạo điều kiện cho chủ nghĩa phát xít phát triển mạnh mẽ. Cùng với đó, các nước như Đức, Ý và Nhật Bản theo đuổi chính sách bành trướng lãnh thổ, trong khi Anh và Pháp lại thực hiện chính sách nhượng bộ, vô tình khuyến khích các hành động xâm lược.
                    </p>
                    <p>
                        Sự kiện trực tiếp làm bùng nổ chiến tranh xảy ra vào ngày 1/9/1939, khi Đức tấn công Ba Lan. Chỉ hai ngày sau, Anh và Pháp tuyên chiến với Đức, chính thức mở đầu Chiến tranh Thế giới II. Từ đây, chiến tranh nhanh chóng lan rộng khắp châu Âu. Đức sử dụng chiến thuật "chiến tranh chớp nhoáng" (Blitzkrieg), liên tiếp giành chiến thắng và nhanh chóng chiếm được nhiều quốc gia như Ba Lan, Đan Mạch, Na Uy và đặc biệt là Pháp vào năm 1940. Tuy nhiên, khi tấn công Anh bằng không quân, Đức đã không đạt được thắng lợi quyết định.
                    </p>
                    <p>
                        Không dừng lại ở châu Âu, chiến tranh tiếp tục mở rộng ra nhiều khu vực khác. Đức tấn công Liên Xô vào năm 1941, khiến chiến sự lan sang Đông Âu. Đồng thời, Ý mở rộng hoạt động quân sự tại châu Phi, còn Nhật Bản đẩy mạnh xâm lược ở châu Á – Thái Bình Dương. Đỉnh điểm là vào ngày 7/12/1941, Nhật Bản bất ngờ tấn công căn cứ Trân Châu Cảng của Mỹ, khiến Mỹ chính thức tham gia chiến tranh. Từ đây, cuộc chiến không còn giới hạn ở khu vực mà đã trở thành một cuộc chiến toàn cầu giữa hai phe: phe Trục (Đức, Ý, Nhật) và phe Đồng minh (Anh, Liên Xô, Mỹ).
                    </p>
                    <p>
                        Nhìn chung, trong giai đoạn 1939–1941, phe Trục nắm ưu thế với hàng loạt chiến thắng nhanh chóng và sự mở rộng mạnh mẽ. Tuy nhiên, sự tham gia của Mỹ đã làm thay đổi cán cân lực lượng, đặt nền móng cho những bước ngoặt quan trọng của chiến tranh ở giai đoạn sau.
                    </p>
                </div>
            </div>

            {/* Pagination / Footer Controls */}
            <div className="sticky bottom-0 mt-12 flex justify-end">
                <div className="bg-[#f0f0f0] rounded-xl flex items-center gap-4 px-6 py-2.5 shadow-sm">
                    <button className="text-gray-500 hover:text-[#5c3a21] transition-all">
                        <ChevronDown size={18} className="rotate-90" />
                    </button>
                    <span className="text-sm font-bold text-gray-800 tabular-nums">1</span>
                    <button className="text-gray-500 hover:text-[#5c3a21] transition-all">
                        <ChevronDown size={18} className="-rotate-90" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button className="text-gray-500 hover:text-[#5c3a21] transition-all">
                        <Monitor size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'Overview', label: 'Tổng quan' },
        { id: 'QA', label: 'Hỏi & Đáp' },
        { id: 'Notes', label: 'Ghi chú' },
        { id: 'Announcements', label: 'Thông báo khóa học' },
        { id: 'Reviews', label: 'Đánh giá học viên' },
        { id: 'Tools', label: 'Công cụ học tập' }
    ];

    const MinigameView = () => (
        <div className="w-full h-full relative group overflow-hidden flex items-center justify-center">
            {/* Cinematic Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/img/bg.jpg')" }}
            >
                {/* Dark Cinematic Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </div>

            {/* Start Button */}
            <button className="relative z-10 px-10 py-4 bg-[#5c3a21] border-2 border-white/40 rounded-xl shadow-2xl hover:bg-[#4a2e1a] hover:scale-105 transition-all group" onClick={() => navigate('/game/ww2')}>
                <span className="text-white text-[28px] font-title font-bold tracking-wide">Bắt đầu</span>
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen font-sans">
            <div className="bg-[#4a321f] text-white px-8 py-3.5 flex items-center justify-between shadow-md relative z-20">
                <div className="flex items-center gap-8">
                    <CourseBreadcrumb
                        courseTitle="Chiến Tranh Thế Giới II: Nguyên Nhân, Diễn Biến và Hệ Quả"
                        className="text-sm"
                    />
                    <div className="flex items-center gap-6 border-l border-white/10 pl-8">
                        <div className="flex items-center gap-1.5">
                            <div className="flex text-yellow-400 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                            <span className="text-sm font-bold opacity-80">5.0</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Clock size={16} />
                            <span>3 giờ</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4a321f]">
                            <BookOpen size={18} />
                        </div>
                        <span className="text-sm font-medium text-white/90">Tiến độ học tập</span>
                        <ChevronDown size={14} className="text-white/40 group-hover:text-white transition-all" />
                    </div>
                    <button className="flex items-center gap-2 bg-transparent border border-white/20 px-5 py-2 rounded-md text-sm font-bold hover:bg-white/10 transition-all">
                        Chia sẻ <Share2 size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-stretch bg-black">
                {/* Visual Area: Video, Document or Minigame */}
                <div className="lg:w-[70%] aspect-video relative group overflow-hidden">
                    {activeLesson.type === 'book' ? (
                        <DocumentReader lesson={activeLesson} />
                    ) : activeLesson.type === 'game' ? (
                        <MinigameView />
                    ) : (
                        <div className="w-full h-full bg-black">
                            {activeLesson.videoId && (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${activeLesson.videoId}?rel=0&modestbranding=1`}
                                    title={activeLesson.name}
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                            {!activeLesson.videoId && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/90 border border-white/10 cursor-pointer hover:scale-110 transition-transform">
                                        <Play size={48} fill="currentColor" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Course Content Sidebar */}
                <div className="lg:w-[30%] min-h-[400px] lg:min-h-0 relative bg-[url('/img/paper-texture.png')]">
                    {/* Scrollable Content Area */}
                    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-8 scrollbar-thin scrollbar-thumb-[#5c3a21]/20 hover:scrollbar-thumb-[#5c3a21]/40">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-[32px] font-title font-bold text-[#5c3a21] leading-tight mb-2">Nội dung khóa học</h2>
                            <p className="text-[13px] text-gray-500 font-medium">
                                5 chương • 15 bài giảng • 3 giờ
                            </p>
                        </div>

                        <div className="space-y-5">
                            {accordionData.map((item, index) => (
                                <CourseAccordionItem
                                    key={index}
                                    {...item}
                                    isActive={activeAccordion === index}
                                    onToggle={() => setActiveAccordion(activeAccordion === index ? -1 : index)}
                                    onLessonSelect={(lesson) => setActiveLesson(lesson)}
                                    variant="default"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Tabs (Left) and Cards (Right) */}
            <div className="flex flex-col lg:flex-row bg-[#FFF6F4] border-t border-black/5">
                {/* Left Side: Tabs & Content (70%) */}
                <div className="lg:w-[70%] flex flex-col border-black/5">
                    {/* Tabs Section */}
                    <div className="border-b border-black/5">
                        <div className="flex gap-8 px-12">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-6 text-[15px] font-bold transition-all relative ${activeTab === tab.id ? 'text-[#5c3a21]' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5c3a21]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-12">
                        {activeTab === 'Overview' && (
                            <CourseOutcome
                                title="Thông tin thêm về khóa học"
                                outcomes={[
                                    "Hiểu rõ nguyên nhân dẫn đến Chiến tranh Thế giới II.",
                                    "Phân tích các sự kiện và bước ngoặt quan trọng của cuộc chiến.",
                                    "Tìm hiểu vai trò của các quốc gia và lãnh đạo trong chiến tranh.",
                                    "Hiểu được tác động của chiến tranh đối với chính trị và xã hội thế giới.",
                                    "Nhận thức được bài học lịch sử để tránh lặp lại những sai lầm trong tương lai."
                                ]}
                            />
                        )}
                    </div>
                </div>

                {/* Right Side: Sidebar Cards (30%) */}
                <div className="lg:w-[30%] p-10 space-y-6">
                    {/* Lên lịch học Card */}
                    <div className="bg-[#FFF6F4] border-2 border-[#5c3a21] rounded-[20px] p-4 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-[#FFF6F4]/5 rounded-xl">
                                <AlarmClock size={24} className="text-[#5c3a21]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Lên lịch học</h3>
                        </div>
                        <p className="text-sm text-[#5c3a21] mb-8 leading-relaxed font-medium">
                            Việc thiết lập thời gian học giúp bạn duy trì thói quen học tập hiệu quả và hoàn thành khóa học đúng tiến độ.
                        </p>
                        <div className="flex gap-4">
                            <button className="flex-grow py-3 bg-[#5c3a21] text-white rounded-full font-bold text-sm hover:bg-[#4a2e1a] transition-all">
                                Bắt đầu
                            </button>
                            <button className="flex-grow py-3 border border-[#5c3a21] text-[#5c3a21] rounded-full font-bold text-sm hover:bg-[#5c3a21]/5 transition-all">
                                Bỏ qua
                            </button>
                        </div>
                    </div>

                    {/* Tiến độ khóa học Card */}
                    <CourseProgressCard
                        totalDuration="3 giờ"
                        studiedTime="1.5 giờ"
                        completedLessons={6}
                        progressPercentage={50}
                        variant="small"
                    />
                </div>
            </div>

            {/* Related Courses Section */}
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
    );
};

export default CourseLearningPage;
