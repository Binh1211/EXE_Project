import React from 'react';
import {
    Home,
    MessageSquare,
    BookOpen,
    Activity,
    Star,
    User,
    Video,
    Bell,
    CheckCircle2,
    GraduationCap,
    Eye,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    BookMarked,
    MapPin,
    PlayCircle
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, active = false, isPro = false }: any) => {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-[#5c3a21] text-white' : 'text-gray-700 hover:bg-white/50'
                }`}
        >
            <Icon size={20} className={active ? 'text-white' : 'text-gray-600'} />
            <span className={`font-medium text-sm flex-1 ${active ? 'text-white' : 'text-gray-800'}`}>
                {text}
            </span>
            {isPro && (
                <span className="text-[10px] bg-[#eab308] text-white px-2 py-0.5 rounded-full font-bold">
                    PRO
                </span>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, iconBg, cardBg }: any) => {
    return (
        <div className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-4 ${cardBg} shadow-sm border border-black/5`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${iconBg}`}>
                <Icon size={24} />
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );
};

const CourseRow = ({ image, title, description, tag, views, price, students }: any) => {
    return (
        <div className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 hover:bg-white/50 transition-colors px-4">
            <div className="col-span-6 flex gap-4 pr-4">
                <img src={image} alt={title} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 text-base mb-1">{title}</h4>
                    {description && <p className="text-xs text-gray-500 line-clamp-2">{description}</p>}
                </div>
            </div>
            <div className="col-span-2 flex items-center">
                {tag && (
                    <span className="text-[10px] bg-[#fdf2e9] text-[#d97706] px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                        {tag}
                    </span>
                )}
            </div>
            <div className="col-span-1 text-sm font-medium text-gray-700">{views}</div>
            <div className="col-span-2 text-sm font-bold text-emerald-500">{price}</div>
            <div className="col-span-1 text-sm font-medium text-gray-700 text-center">{students}</div>
        </div>
    );
};

const RegionBar = ({ name, users, percentage, color }: any) => {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-600 w-24 truncate">{name}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 flex items-center relative overflow-hidden">
                <div className={`h-full ${color} opacity-20 absolute left-0 top-0`} style={{ width: percentage }}></div>
                <div className="flex items-center justify-center w-full relative z-10 gap-1 text-[10px] font-medium text-gray-700">
                    <MapPin size={10} /> {users}
                </div>
            </div>
            <span className="text-xs font-medium text-gray-500 w-8 text-right">{percentage}</span>
        </div>
    );
};

export default function CoursePage() {
    return (
        <div className="min-h-screen font-sans  flex overflow-hidden "
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>

            {/* Left Sidebar */}
            <aside className="w-[260px] flex-shrink-0 flex flex-col items-center py-8 px-6 border-r border-black/5">
                <div className="flex flex-col items-center mb-10">
                    <img
                        src="/img/logo.png"
                        alt="EXE"
                    />
                </div>

                <nav className="w-full flex-1 flex flex-col gap-2">
                    <SidebarItem icon={Home} text="Trang chủ" active />
                    <SidebarItem icon={MessageSquare} text="Trò chuyện" />
                    <SidebarItem icon={BookOpen} text="Khóa học của bạn" />
                    <SidebarItem icon={Activity} text="Tình trạng" isPro />
                    <SidebarItem icon={Star} text="Đánh giá" isPro />
                    <SidebarItem icon={User} text="Tài khoản" />
                </nav>

                <div className="w-full bg-[#fdf8e7] rounded-xl p-5 mt-auto text-center border border-black/5">
                    <h4 className="font-bold text-gray-800 text-sm mb-2">Nâng cấp tài khoản</h4>
                    <p className="text-[10px] text-gray-500 mb-4">Khám phá các tính năng mới thông qua việc đăng ký các gói nâng cấp của chúng tôi</p>
                    <button className="w-full bg-[#5c3a21] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#4a2e1a] transition-colors">
                        Nâng cấp ngay
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
                <div className="p-8 max-w-[1200px] w-full mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl text-gray-800 font-serif mb-1">
                                Xin chào, <span className="font-bold">Minh Anh</span>
                            </h2>
                            <p className="text-gray-500 text-sm">Hãy cùng nhau học thêm nhiều kiến thức mới nào!</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 bg-[#5c3a21] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#4a2e1a] transition-colors">
                                <Video size={18} />
                                Khóa học mới
                            </button>
                            <button className="p-2.5 rounded-lg bg-white/50 border border-black/5 hover:bg-white text-gray-600 transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#f4ebd8]"></span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        <StatCard
                            icon={BookMarked}
                            title="Khóa học mới"
                            value="168"
                            iconBg="bg-[#3b82f6]"
                            cardBg="bg-[#eef2ff]"
                        />
                        <StatCard
                            icon={CheckCircle2}
                            title="Khóa học đã hoàn thành"
                            value="$13,851"
                            iconBg="bg-[#14b8a6]"
                            cardBg="bg-[#e6fffa]"
                        />
                        <StatCard
                            icon={GraduationCap}
                            title="Tổng học viên"
                            value="5,622"
                            iconBg="bg-[#f43f5e]"
                            cardBg="bg-[#fff1f2]"
                        />
                        <StatCard
                            icon={Eye}
                            title="Người học mới hôm nay"
                            value="110"
                            iconBg="bg-[#eab308]"
                            cardBg="bg-[#fefce8]"
                        />
                    </div>

                    {/* Course List */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-lg">Các khóa học hiện có</h3>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
                                    Phân loại <ChevronDown size={16} />
                                </button>
                                <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
                                    Theo lớp <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/40 rounded-2xl overflow-hidden border border-black/5 shadow-sm">
                            {/* Table Header */}
                            <div className="bg-[#5c3a21] text-white grid grid-cols-12 gap-4 px-4 py-3 rounded-t-2xl">
                                <div className="col-span-6 font-semibold text-sm pl-4">Tên khóa học</div>
                                <div className="col-span-2"></div>
                                <div className="col-span-1 font-semibold text-sm">Lượt xem</div>
                                <div className="col-span-2 font-semibold text-sm">Giá</div>
                                <div className="col-span-1 font-semibold text-sm text-center">Học viên</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col">
                                <CourseRow
                                    image="https://images.unsplash.com/photo-1599939571322-792f328f6153?q=80&w=200&auto=format&fit=crop"
                                    title="Chiến Tranh Thế Giới II"
                                    description="Hiểu rõ nguyên nhân dẫn đến Chiến tranh Thế giới II, các sự kiện quan trọng và tác động của các cuộc chiến đối với thế giới hiện đại."
                                    tag="Dùng thử miễn phí"
                                    views="17,913"
                                    price="79.000đ"
                                    students="62"
                                />
                                <CourseRow
                                    image="https://images.unsplash.com/photo-1544253198-8e682d3340f1?q=80&w=200&auto=format&fit=crop"
                                    title="Các Nền Văn Minh Lớn Trong Lịch Sử"
                                    description="Tìm hiểu cách các nền văn minh phát triển, giao thương và ảnh hưởng đến thế giới hiện đại."
                                    tag="Dùng thử miễn phí"
                                    views="64,142"
                                    price="99.000đ"
                                    students="21"
                                />
                                <CourseRow
                                    image="https://images.unsplash.com/photo-1590426176378-577bf6ee45de?q=80&w=200&auto=format&fit=crop"
                                    title="Chiến Tranh Thế Giới I & II"
                                    description="Phân tích nguyên nhân, diễn biến và hậu quả của hai cuộc chiến lớn nhất trong lịch sử nhân loại."
                                    views="38,841"
                                    price="119.000đ"
                                    students="43"
                                />
                                <CourseRow
                                    image="https://images.unsplash.com/photo-1545620815-46aa1a396e9d?q=80&w=200&auto=format&fit=crop"
                                    title="Lịch Sử Việt Nam Từ Cổ Đại Đến Hiện Đại"
                                    description="Hành trình qua các triều đại, các cuộc kháng chiến và sự phát triển của Việt Nam."
                                    views="53,814"
                                    price="149.000đ"
                                    students="181"
                                />
                                <CourseRow
                                    image="https://images.unsplash.com/photo-1589839498262-1ec5be3a0f76?q=80&w=200&auto=format&fit=crop"
                                    title="Các Đế Chế Lớn Trong Lịch Sử Nhân Loại"
                                    description="Tìm hiểu về đế chế La Mã, Mông Cổ, Ottoman và cách họ thay đổi thế giới."
                                    tag="Dùng thử miễn phí"
                                    views="21,741"
                                    price="99.000đ"
                                    students="73"
                                />
                                <CourseRow
                                    image="https://images.unsplash.com/photo-1621287400346-609ecdd727b1?q=80&w=200&auto=format&fit=crop"
                                    title="Phong Trào Giải Phóng Dân Tộc Trên Thế Giới"
                                    description="Khám phá các cuộc đấu tranh giành độc lập của nhiều quốc gia trên thế giới."
                                    views="18,853"
                                    price="79.000đ"
                                    students="31"
                                />
                            </div>

                            {/* Pagination */}
                            <div className="p-4 flex justify-center items-center gap-4 border-t border-gray-200">
                                <button className="text-gray-400 hover:text-gray-600"><ChevronLeft size={18} /></button>
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <button className="w-6 h-6 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center">1</button>
                                    <button className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center">2</button>
                                    <button className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center">3</button>
                                    <button className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center">4</button>
                                </div>
                                <button className="text-gray-600 hover:text-gray-800"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-[320px] flex-shrink-0 bg-white/40 border-l border-black/5 h-screen overflow-y-auto px-6 py-8 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)]">

                {/* Profile */}
                <div className="mb-10 w-full">
                    <h3 className="font-bold text-gray-800 text-lg mb-4">Hồ sơ</h3>
                    <div className="flex items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">Nguyễn Minh Anh</h4>
                            <p className="text-xs text-gray-500">Lịch sử & Văn minh thế giới</p>
                        </div>
                    </div>
                </div>

                {/* Highlighted Courses */}
                <div className="mb-10 w-full">
                    <h3 className="font-bold text-gray-800 text-lg mb-4">Khóa học nổi bật</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#fefce8] text-[#eab308] flex items-center justify-center">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-xs">Lịch Sử Việt Nam Qua Các Thời Kỳ</h4>
                                    <p className="text-[10px] text-gray-400">12+ khóa học</p>
                                </div>
                            </div>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold py-1 px-3 rounded-md transition-colors whitespace-nowrap">
                                Xem Khóa Học
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#fee2e2] text-[#ef4444] flex items-center justify-center">
                                    <PlayCircle size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-xs">Lịch Sử Thế Giới</h4>
                                    <p className="text-[10px] text-gray-400">10+ khóa học</p>
                                </div>
                            </div>
                            <button className="bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#be185d] text-[10px] font-bold py-1 px-3 rounded-md transition-colors whitespace-nowrap">
                                Xem Khóa Học
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center">
                                    <BookOpen size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-xs">Các Cuộc Chiến Tranh Lớn</h4>
                                    <p className="text-[10px] text-gray-400">8+ khóa học</p>
                                </div>
                            </div>
                            <button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] text-[10px] font-bold py-1 px-3 rounded-md transition-colors whitespace-nowrap">
                                Xem Khóa Học
                            </button>
                        </div>
                    </div>
                </div>

                {/* Region Stats */}
                <div className="mb-10 w-full pt-6 border-t border-black/5">
                    <h3 className="font-bold text-gray-800 text-sm mb-5">Khu vực có nhiều học viên</h3>
                    <div>
                        <RegionBar name="TP. Hồ Chí Minh" users="3,561" percentage="30%" color="bg-[#eab308]" />
                        <RegionBar name="Hà Nội" users="2,551" percentage="20%" color="bg-[#ef4444]" />
                        <RegionBar name="Đà Nẵng" users="2,125" percentage="15%" color="bg-[#f9d78e]" />
                        <RegionBar name="Cần Thơ" users="1,925" percentage="12%" color="bg-[#d8b4e2]" />
                        <RegionBar name="Quy Nhơn" users="2,725" percentage="17%" color="bg-[#86efac]" />
                    </div>
                </div>

                {/* Next Lesson */}
                <div className="w-full pt-6 border-t border-black/5">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Bài học tiếp theo</h3>
                    <div className="text-center mb-4">
                        <h4 className="font-serif font-bold text-gray-800 text-base mb-1">Bài 5: Sự sụp đổ của Đế chế La Mã</h4>
                        <p className="text-xs text-gray-500">Thời lượng: 20 phút</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-md relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1549488344-1f9b8d2ad1c3?q=80&w=400&auto=format&fit=crop" alt="Roman Empire" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[#5c3a21]">
                                <PlayCircle size={28} />
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
