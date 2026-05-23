import { Clock, Star, Heart } from 'lucide-react';

interface RelatedCourseCardProps {
    image: string;
    title: string;
    rating: string;
    description: string;
}

export const RelatedCourseCard = ({
    image,
    title,
    rating,
    description
}: RelatedCourseCardProps) => (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full border border-black/5">
        <div className="p-5 pb-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
        </div>
        <div className="p-7 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-6 text-[13px] text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                        ))}
                    </div>
                    <span className="font-bold text-gray-800">{rating}</span>
                </div>
            </div>

            <h4 className="font-serif font-bold text-gray-800 text-[20px] leading-[1.3] mb-4 line-clamp-2 flex-grow">
                {title}
            </h4>

            <p className="text-[13px] text-gray-500 mb-8 leading-relaxed line-clamp-2">
                {description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <button className="px-8 py-3 rounded-full text-xs font-bold transition-all transform active:scale-95 border bg-white text-[#5c3a21] border-gray-200 hover:bg-[#5c3a21] hover:text-white hover:border-[#5c3a21]">
                    Bắt đầu học
                </button>
                <button className="p-3 rounded-full text-gray-400 hover:text-red-500 transition-all border border-transparent hover:bg-red-50">
                    <Heart size={20} />
                </button>
            </div>
        </div>
    </div>
);
