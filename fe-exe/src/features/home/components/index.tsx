import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpenCheck,
  Clock,
  Users,
  Map,
  ClipboardCheck,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const team = [
  {
    name: "Hoàng Công Bình ",
    role: "Dev",
    image: "",
  },
  {
    name: "Nguyễn Lưu Gia Huy",
    role: "Truyền thông",
    image: "",
  },
  {
    name: "Mai Anh Kiệt",
    role: "Design",
    image: "",
  },
  {
    name: "Lê Trịnh Thụy Vy",
    role: "Truyền thông",
    image: "",
  },
  {
    name: "Trần Tuấn Anh",
    role: "Dev",
    image: "",
  },
];
const features = [
  {
    imge: IMG.VL_AL,
    title: "Bài học ngắn, dễ hiểu",
    desc: "Tóm lược theo mốc sự kiện, nhân vật, bối cảnh – kèm hình ảnh, bản đồ.",
    icon: BookOpenCheck,
    rating: 4.5,
    reviewCount: 1200,
    comment: "Bài học dễ hiểu, hình ảnh minh họa rõ ràng.",
  },
  {
    imge: IMG.bacThuoc,
    title: "Dòng thời gian trực quan",
    desc: "Xem lịch sử theo timeline rõ ràng, dễ ghi nhớ.",
    icon: Clock,
    rating: 4.7,
    reviewCount: 1500,
    comment: "Timeline giúp mình nhớ sự kiện theo trình tự dễ dàng hơn.",
  },
  {
    imge: IMG.thoiBinh,
    title: "Nhân vật nổi bật",
    desc: "Tìm hiểu tiểu sử và đóng góp quan trọng.",
    icon: Users,
    rating: 4.6,
    reviewCount: 1800,
    comment: "Giúp mình hiểu rõ hơn về các nhân vật lịch sử quan trọng.",
  },
  {
    imge: IMG.nam1945,
    title: "Bản đồ & hình ảnh",
    desc: "Minh họa trực quan giúp hiểu sâu hơn.",
    icon: Map,
    rating: 4.8,
    reviewCount: 2000,
    comment:
      "Hình ảnh và bản đồ giúp mình hình dung rõ hơn về bối cảnh lịch sử.",
  },
  {
    imge: IMG.thongNhat,
    title: "Ôn tập nhanh",
    desc: "Tóm tắt kiến thức trọng tâm trước khi kiểm tra.",
    icon: ClipboardCheck,
    rating: 4.7,
    reviewCount: 1700,
    comment:
      "Ôn tập nhanh giúp mình chuẩn bị tốt hơn cho các bài kiểm tra lịch sử.",
  },
];

export default function Home() {
  return (
    // <div className="flex flex-col gap-10 bg-gradient-to-b from-[#fbf0ce] via-[#d8d0ad] to-[#f9f4e6]">
    <div className="flex flex-col gap-10 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-1/2 px-6 md:pl-[10%] mt-10 md:mt-20 mb-1 flex flex-col gap-5">
          <h1 className="text-4xl md:text-7xl font-bold text-[#623715]">Vistory</h1>
          <h2 className="font-bold text-[#000000] text-2xl md:text-5xl">
            Học Lịch sử Việt Nam theo cách
          </h2>
          <h2 className="text-2xl md:text-5xl font-bold text-[#623715]">“chơi mà học”</h2>
          <p className="text-sm text-[#623715] mt-4">
            Bài học ngắn gọn, trực quan theo từng giai đoạn lịch sử. Minigame –
            thử thách – quiz giúp nhớ lâu, hiểu sâu và học có động lực.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button className="w-full sm:w-auto px-6 py-3 text-sm shadow-none rounded-xl font-medium bg-[#5f3713] text-white hover:bg-[#ad9d8c]">
              Bắt đầu học miễn phí
            </Button>
            <Button className="w-full sm:w-auto px-6 py-3 text-sm shadow-none rounded-xl font-medium bg-[#fff3e9] text-[#5f3713] hover:bg-[#ad9d8c] hover:text-white">
              Xem lộ trình học
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 mr-0 md:mr-[15%] mt-6 md:mt-20 relative flex h-64 md:h-[300px] pb-8 md:pb-0">
          <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-[#5f3713] rounded-full" />
          </div>
          <div className="absolute left-1/2 top-[70%] w-64 h-64 md:w-96 md:h-96 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={IMG.home1}
              alt="Homepage image"
              className="w-full h-full object-contain rounded-full max-w-full"
            />
          </div>
          <div
            style={{ border: "1px solid #000" }}
            className="hidden sm:flex absolute left-1/2 top-[70%] sm:translate-x-[-240px] sm:translate-y-[-110px] sm:w-36 sm:h-16 w-28 h-14 bg-white rounded-xl flex-col sm:flex-row justify-between items-center gap-3 shadow-md z-20"
          >
            <img src={IMG.home2} className="ml-3 sm:ml-5 w-9 sm:w-11 h-9 sm:h-11 rounded-xl" />
            <div className="mr-3 sm:mr-5">
              <h2 className="text-lg font-bold text-[#000000]">15+</h2>
              <h3 className="text-sm text-gray-400">Minigame</h3>
            </div>
          </div>
          <div
            style={{ border: "1px solid #000" }}
            className="hidden sm:flex absolute left-1/2 top-[70%] sm:translate-x-[150px] sm:translate-y-[-110px] sm:w-20 sm:h-28 w-16 h-24 bg-white rounded-xl gap-3 shadow-md z-20"
          >
            <img
              src={IMG.home3}
              className="ml-3 sm:ml-5 w-9 sm:w-11 h-9 sm:h-11 rounded-full mt-3"
            />
            <div className="ml-2">
              <h2 className="ml-1 text-lg font-bold text-[#000000]">200+</h2>
              <h3 className="text-xs text-gray-400">Khóa học</h3>
            </div>
          </div>
          <div
            style={{ border: "1px solid #000" }}
            className="hidden sm:flex absolute left-1/2 top-[70%] sm:translate-x-[0px] sm:translate-y-[140px] sm:w-36 sm:h-16 w-32 h-14 bg-white rounded-xl flex-col sm:flex-row justify-between items-center gap-3 shadow-md z-20"
          >
            <img src={IMG.home4} className="ml-3 sm:ml-5 w-9 sm:w-11 h-9 sm:h-11 rounded-xl" />
            <div className="mr-2">
              <h3 className="text-xs text-gray-400">Giảng viên</h3>
              <h2 className="ml-1 text-lg font-bold text-[#000000]">100+</h2>
            </div>
          </div>
        </div>
      </div>
      <div id="features">
        <div className="text-center mt-24 md:mt-10">
          <h1 className="text-3xl font-bold ">
            Vistory giúp bạn học sử dễ hơn – vui hơn – nhớ lâu hơn
          </h1>
        </div>
      </div>
      <Carousel
        className="w-[90%] max-w-6xl mx-auto  relative"
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="-ml-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <CarouselItem
                key={index}
                className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="group bg-white rounded-xl hover:bg-[#623715] hover:text-white transition h-full">
                  <CardHeader>
                    <div className="flex flex-row items-center gap-5">
                      <Icon className="size-10" />

                      <CardTitle className="text-xl font-semibold">
                        {item.title}
                      </CardTitle>
                    </div>

                    <CardDescription className="text-gray-400 group-hover:text-gray-200 transition">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className=" text-[#fbf0ce] hover:bg-black hover:text-white" />
        <CarouselNext className="text-[#fbf0ce] hover:bg-black hover:text-white" />
        <CarouselDots className="text-black " />
      </Carousel>
      <div>
        <div className=" ml-[10%] mt-10">
          <h1 className="text-3xl font-bold ">
            Lộ trình học theo giai đoạn lịch sử
          </h1>
          <h1 className="text-xl  mt-5 text-gray-500">
            Đi từ thời dựng nước đến hiện đại – mỗi giai đoạn là một chặng học,
            mỗi bài học là một trải nghiệm.
          </h1>
        </div>
        <div>
          <Carousel
            className="mt-5 w-[80%] max-w-7xl mx-auto  relative  "
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent className="-ml-6">
              {features.map((item, index) => {
                return (
                  <CarouselItem
                    key={index}
                    className="pl-6 basis-full sm:basis-1/2 lg:basis-1/4"
                  >
                    <Card className="group rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer border-0 shadow-md">
                      <img
                        src={item.imge}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className=" text-[#fbf0ce] hover:bg-black hover:text-white" />
            <CarouselNext className="text-[#fbf0ce] hover:bg-black hover:text-white" />
            <CarouselDots className="text-black " />
          </Carousel>
        </div>
      </div>
      <div id="team" className="">
        <div>
          <h1 className="text-3xl font-bold text-center mt-10">
            Đội ngũ xây dựng Vistory
          </h1>
          <h2 className="text-xl text-gray-500 text-center mt-5">
            Giáo viên, biên tập viên lịch sử và đội ngũ công nghệ cùng tạo nên
            trải nghiệm học sử hiện đại.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-8 px-4 md:px-0">
            {team.map((item, index) => (
              <div key={index} className="p-4">
                <Card className=" bg-white rounded-xl  transition h-full flex flex-col items-center justify-center text-center">
                  <img
                    src={item.image}
                    className="mt-4 w-12 h-12 rounded-full object-cover"
                  />
                  <CardHeader className="flex flex-col items-center justify-center text-center">
                    <div className="flex flex-row items-center gap-5">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {item.name}
                      </CardTitle>
                    </div>

                    <CardDescription className="text-gray-400">
                      {item.role}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="benefits" className="bg-[#fff3e9]">
        <Carousel
          className="mt-5 w-[80%] max-w-7xl mx-auto  relative  "
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-6">
            {features.map((item, index) => {
              return (
                <CarouselItem key={index} className=" basis-full  ">
                  <div className="flex flex-col items-center justify-center text-center">
                    <img src={IMG.logo} className="w-40 h-40 " />
                    <div className="text-lg mt-4">{item.comment}</div>
                    <img
                      src={item.imge}
                      className="rounded-full w-10 h-10 mt-4"
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className=" text-[#fbf0ce] hover:bg-black hover:text-white" />
          <CarouselNext className="text-[#fbf0ce] hover:bg-black hover:text-white" />
          <CarouselDots className="text-black " />
        </Carousel>
      </div>

    </div>
  );
}
