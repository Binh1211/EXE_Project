import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Star,
    ChevronDown,
    Share2,
    Play,
    Monitor,
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
import FlashCards from './shared/flash-card';
import FAQBot from './shared/faq-bot';

// Shared components are imported from './shared'

const CourseLearningPage = () => {
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [activeTab, setActiveTab] = useState('Overview');
    const [unlockedChapter, setUnlockedChapter] = useState(0);
    const [chapterCompleted, setChapterCompleted] = useState(false);
    const [videoWatched, setVideoWatched] = useState(false);
    const [searchParams] = useSearchParams();
    const lessonNameFromUrl = searchParams.get('lesson');
    const navigate = useNavigate();

    // Refs for YouTube IFrame Player API
    const ytContainerRef = useRef<HTMLDivElement>(null);
    const ytPlayerRef = useRef<any>(null);

    useEffect(() => {
        const unlocked = parseInt(localStorage.getItem('unlockedChapter') || '0', 10);
        setUnlockedChapter(unlocked);
    }, []);

    const accordionData = [
        {
            title: "Chương 1: Bối cảnh trước chiến tranh",
            lessons: [
                { name: "Tình hình thế giới sau Thế chiến I", type: 'video' as const, videoId: "NKpMA_gLrdE" },
                { name: "Sự trỗi dậy của chủ nghĩa phát xít", type: 'book' as const },
                { name: "Minigame kiểm tra", type: "game" as const }
            ]
        },
        {
            title: "Chương 2: Diễn biến chính của chiến tranh",
            lessons: [
                { name: "Chiến tranh bùng nổ tại Châu Âu", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        },
        {
            title: "Chương 3: Những nhân vật và quốc gia quan trọng",
            lessons: [
                { name: "Các phe trục", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        },
        {
            title: "Chương 4: Hệ quả của chiến tranh",
            lessons: [
                { name: "Sự phân chia lại cục diện thế giới", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        },
        {
            title: "Chương 5: Bài học lịch sử từ Chiến tranh thế giới II",
            lessons: [
                { name: "Tổng kết", type: 'video' as const, videoId: "NKpMA_gLrdE" }
            ]
        }
    ];

    const [activeLesson, setActiveLesson] = useState<any>(accordionData[0].lessons[0]);

    // Determine current chapter index and whether it has a game
    const currentChapterIndex = accordionData.findIndex(ch =>
        ch.lessons.some(l => l.name === activeLesson?.name)
    );
    const currentChapter = currentChapterIndex >= 0 ? accordionData[currentChapterIndex] : null;
    const chapterHasGame = currentChapter?.lessons.some(l => l.type === 'game') ?? false;
    const isLastLessonOfChapter =
        currentChapter !== null &&
        currentChapter.lessons[currentChapter.lessons.length - 1]?.name === activeLesson?.name;
    // For video lessons: must watch to end. For book lessons: always ready.
    const isLessonCompleted =
        activeLesson?.type === 'video' ? videoWatched : true;

    const canCompleteWithoutGame =
        !chapterHasGame &&
        isLastLessonOfChapter &&
        currentChapterIndex === unlockedChapter &&
        currentChapterIndex < accordionData.length - 1 &&
        isLessonCompleted;

    // Reset video watched + completed badge when lesson changes
    useEffect(() => {
        setChapterCompleted(false);
        setVideoWatched(false);
    }, [activeLesson]);

    // YouTube IFrame Player API: create player when video lesson is active
    useEffect(() => {
        if (activeLesson?.type !== 'video' || !activeLesson?.videoId) return;

        let playerInstance: any = null;

        const createPlayer = () => {
            if (!ytContainerRef.current) return;
            // Destroy previous player
            if (ytPlayerRef.current) {
                try { ytPlayerRef.current.destroy(); } catch { /* ignore */ }
                ytPlayerRef.current = null;
            }
            // YT.Player replaces the div with an iframe
            ytContainerRef.current.innerHTML = '';
            const div = document.createElement('div');
            ytContainerRef.current.appendChild(div);

            playerInstance = new (window as any).YT.Player(div, {
                videoId: activeLesson.videoId,
                width: '100%',
                height: '100%',
                playerVars: { rel: 0, modestbranding: 1 },
                events: {
                    onStateChange: (event: any) => {
                        // State 0 = video ended
                        if (event.data === 0) setVideoWatched(true);
                    }
                }
            });
            ytPlayerRef.current = playerInstance;
        };

        if ((window as any).YT?.Player) {
            // API already loaded
            createPlayer();
        } else {
            // Load the API script if not already added
            if (!document.getElementById('yt-iframe-api-script')) {
                const script = document.createElement('script');
                script.id = 'yt-iframe-api-script';
                script.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(script);
            }
            // Queue our callback (preserve any existing one)
            const existing = (window as any).onYouTubeIframeAPIReady;
            (window as any).onYouTubeIframeAPIReady = () => {
                existing?.();
                createPlayer();
            };
        }

        return () => {
            if (playerInstance) {
                try { playerInstance.destroy(); } catch { /* ignore */ }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLesson?.videoId, activeLesson?.type]);

    const handleCompleteChapter = () => {
        const next = currentChapterIndex + 1;
        localStorage.setItem('unlockedChapter', next.toString());
        setUnlockedChapter(next);
        setChapterCompleted(true);
    };

    // Handle deep linking from URL ?lesson=Name
    useEffect(() => {
        if (lessonNameFromUrl) {
            accordionData.forEach((chapter, chapterIndex) => {
                const foundLesson = chapter.lessons.find(l => l.name === lessonNameFromUrl);
                if (foundLesson) {
                    if (chapterIndex <= unlockedChapter) {
                        setActiveLesson(foundLesson);
                        setActiveAccordion(chapterIndex);
                    }
                }
            });
        }
    }, [lessonNameFromUrl, unlockedChapter]);

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
        { id: 'FAQ', label: 'Hỏi & Đáp' },
        { id: 'Review', label: 'Ôn tập' },
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
            <button className="relative z-10 px-10 py-4 bg-[#5c3a21] border-2 border-white/40 rounded-xl shadow-2xl hover:bg-[#4a2e1a] hover:scale-105 transition-all group" onClick={() => navigate(`/game/ww2?chapter=${currentChapterIndex}`)}>
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
                            {/* YouTube IFrame Player API mounts here via ytContainerRef */}
                            <div ref={ytContainerRef} className="w-full h-full" />
                            {!activeLesson.videoId && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/90 border border-white/10 cursor-pointer hover:scale-110 transition-transform">
                                        <Play size={48} fill="currentColor" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Unlock next chapter button for chapters without game/quiz */}
                    {canCompleteWithoutGame && (
                        <div className="absolute bottom-4 right-4 z-20">
                            {!chapterCompleted ? (
                                <button
                                    onClick={handleCompleteChapter}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-200 border border-emerald-400/30"
                                >
                                    <AlarmClock size={16} />
                                    Hoàn thành chương & Mở khóa tiếp theo
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 bg-emerald-700/80 text-white font-bold px-5 py-2.5 rounded-xl shadow border border-emerald-400/30 backdrop-blur">
                                    <Video size={16} />
                                    Chương đã mở khóa! 🎉
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
                                5 chương • 15 bài giảng
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
                                    isLocked={index > unlockedChapter}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row bg-[#FFF6F4] border-t border-black/5">
                <div className="lg:w-[100%] flex flex-col border-black/5">
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
                    <div className="p-4">
                        {activeTab === 'Overview' && (
                            <>
                                <div className="flex flex-row items-start justify-between">
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
                                    <CourseProgressCard
                                        progressPercentage={50}
                                        variant="large"
                                    />
                                </div>
                            </>
                        )}
                        {activeTab === 'Review' && (
                            <div className="mt-6 mx-[7%] flex flex-col items-center pb-10">
                                <div className="w-full mb-4">
                                    <h3 className="text-2xl font-bold text-[#5c3a21]">
                                        Ôn tập kiến thức
                                    </h3>
                                </div>
                                <FlashCards
                                    cards={[
                                        {
                                            year: "1939",
                                            content: "Đức xâm lược Ba Lan, khởi đầu Chiến tranh Thế giới II.",
                                        },
                                        {
                                            year: "1941",
                                            content: "Nhật Bản tấn công Trân Châu Cảng, Mỹ chính thức tham chiến.",
                                        },
                                        {
                                            year: "1945",
                                            content: "Đức và Nhật Bản đầu hàng, chiến tranh kết thúc.",
                                        },
                                    ]}
                                />
                            </div>
                        )}
                        {activeTab === 'FAQ' && (
                            <div className="mt-6 mx-[7%] flex flex-col items-center pb-10">
                                <FAQBot
                                    data={[
                                        {
                                            question: "Khi nào Chiến tranh Thế giới thứ II bắt đầu?",
                                            answer: "Chiến tranh Thế giới thứ II bắt đầu vào ngày 1 tháng 9 năm 1939.",
                                        },
                                        {
                                            question: "Ai là lãnh đạo của Đức trong thời gian chiến tranh?",
                                            answer: "Adolf Hitler là lãnh đạo của Đức Quốc xã trong thời gian chiến tranh.",
                                        },
                                        {
                                            question: "Hoa Kỳ có tham gia chiến tranh ngay từ đầu không?",
                                            answer: "Không, Hoa Kỳ ban đầu giữ thái độ trung lập nhưng đã chính thức tham chiến vào tháng 12 năm 1941 sau vụ tấn công Trân Châu Cảng.",
                                        },
                                        {
                                            question: "Chiến tranh kết thúc khi nào?",
                                            answer: "Chiến tranh kết thúc vào năm 1945, khi Đức đầu hàng vào tháng 5 và Nhật Bản đầu hàng vào tháng 9.",
                                        },
                                        {
                                            question: "Hậu quả chính của chiến tranh là gì?",
                                            answer: "Chiến tranh dẫn đến cái chết của hàng chục triệu người, sự tan rã của các đế quốc châu Âu, sự trỗi dậy của Hoa Kỳ và Liên Xô như hai siêu cường, và sự thành lập Liên Hợp Quốc.",
                                        },
                                    ]}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Related Courses Section */}
            <div className="pt-16  overflow-hidden">
                <div className="absolute inset-0 -z-10"></div>

                <div className="max-w-[1280px] mx-auto px-10  z-10">
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
                            rating="5.0"
                            description="Tìm hiểu hành trình phát triển của Việt Nam từ thời kỳ dựng nước qua các triều đại lịch sử."
                        />
                        <RelatedCourseCard
                            image="/img/news2.png"
                            title="Những Cuộc Chiến Tranh Lớn Trong Lịch Sử"
                            rating="5.0"
                            description="Phân tích nguyên nhân, diễn biến và kết quả của các cuộc chiến lớn thay đổi lịch sử thế giới."
                        />
                        <RelatedCourseCard
                            image="/img/news3.png"
                            title="Các Nền Văn Minh Cổ Đại"
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
