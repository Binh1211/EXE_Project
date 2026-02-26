import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpenCheck,
  Clock,
  Users,
  Map,
  ClipboardCheck,
  Star,
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
    name: "Hoàng Công BÌnh ",
    role: "Dev",
    image: "/img/home1.png",
  },
  {
    name: "Nguyễn Lưu Gia Huy",
    role: "Truyền thông",
    image: "/img/home2.png",
  },
  {
    name: "Mai Anh Kiệt",
    role: "Design",
    image: "/img/home4.png",
  },
  {
    name: "Lê Trịnh Thụy Vy",
    role: "Truyền thông",
    image: "/img/home3.png",
  },
  {
    name: "Trần Tuấn Anh",
    role: "Dev",
    image: "/img/home5.png",
  },
];
const features = [
  {
    imge: "/img/home1.png",
    title: "Bài học ngắn, dễ hiểu",
    desc: "Tóm lược theo mốc sự kiện, nhân vật, bối cảnh – kèm hình ảnh, bản đồ.",
    icon: BookOpenCheck,
    rating: 4.5,
    reviewCount: 1200,
    comment: "Bài học dễ hiểu, hình ảnh minh họa rõ ràng.",
  },
  {
    imge: "/img/home2.png",
    title: "Dòng thời gian trực quan",
    desc: "Xem lịch sử theo timeline rõ ràng, dễ ghi nhớ.",
    icon: Clock,
    rating: 4.7,
    reviewCount: 1500,
    comment: "Timeline giúp mình nhớ sự kiện theo trình tự dễ dàng hơn.",
  },
  {
    imge: "/img/home3.png",
    title: "Nhân vật nổi bật",
    desc: "Tìm hiểu tiểu sử và đóng góp quan trọng.",
    icon: Users,
    rating: 4.6,
    reviewCount: 1800,
    comment: "Giúp mình hiểu rõ hơn về các nhân vật lịch sử quan trọng.",
  },
  {
    imge: "/img/home4.png",
    title: "Bản đồ & hình ảnh",
    desc: "Minh họa trực quan giúp hiểu sâu hơn.",
    icon: Map,
    rating: 4.8,
    reviewCount: 2000,
    comment:
      "Hình ảnh và bản đồ giúp mình hình dung rõ hơn về bối cảnh lịch sử.",
  },
  {
    imge: "/img/home5.png",
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
    <div className="flex flex-col gap-10 bg-gradient-to-b from-[#fbf0ce] to-[#f9f4e6]">
      <div className="flex justify-between items-start">
        <div className="w-[35%] ml-[10%] mt-20 mb-1 flex flex-col gap-5">
          <h1 className="text-7xl font-bold text-[#623715] ">Vistory</h1>
          <h2 className=" font-bold text-[#000000] text-5xl text-wrap">
            Học Lịch sử Việt Nam theo cách
          </h2>
          <h2 className="text-5xl font-bold text-[#623715] ">“chơi mà học”</h2>
          <p className="text-sm text-[#623715] mt-4">
            Bài học ngắn gọn, trực quan theo từng giai đoạn lịch sử. Minigame –
            thử thách – quiz giúp nhớ lâu, hiểu sâu và học có động lực.
          </p>
          <div className="flex gap-4 mt-6">
            <Button className="w-[40%] h-[15%] text-sm shadow-none rounded-xl font-medium bg-[#5f3713] text-white hover:bg-[#ad9d8c] hover:rounded-xl">
              Bắt đầu học miễn phí
            </Button>
            <Button className="w-[40%] h-[15%] text-sm shadow-none rounded-xl font-medium bg-[#fff3e9] text-[#5f3713] hover:bg-[#ad9d8c] hover:text-white hover:rounded-xl">
              Xem lộ trình học
            </Button>
          </div>
        </div>
        <div className="mr-[15%] mt-20 relative flex h-[300px] w-[400px]">
          <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="w-96 h-96 bg-[#5f3713] rounded-full"></div>
          </div>
          <div className="absolute left-1/2 top-[70%] w-96 h-96 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src="/img/home1.png"
              alt="Homepage image"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div
            style={{ border: "1px solid #000" }}
            className="absolute left-1/2 top-[70%]  translate-x-[-240px] translate-y-[-110px] w-36 h-16 bg-white rounded-xl flex justify-between items-center gap-3 shadow-md z-20"
          >
            <img src="/img/home2.png" className=" ml-5 w-11 h-11 rounded-xl" />
            <div className="mr-5">
              <h2 className="text-lg font-bold text-[#000000]">15+</h2>
              <h3 className="text-sm text-gray-400">Minigame</h3>
            </div>
          </div>
          <div
            style={{ border: "1px solid #000" }}
            className="absolute left-1/2 top-[70%]  translate-x-[150px] translate-y-[-110px] w-20 h-28 bg-white rounded-xl  gap-3 shadow-md z-20 "
          >
            <img
              src="/img/home3.png"
              className="ml-5  w-11 h-11 rounded-full mt-3"
            />
            <div className="ml-4">
              <h2 className=" ml-1 text-lg font-bold text-[#000000]">200+</h2>
              <h3 className="text-xs text-gray-400">Khóa học</h3>
            </div>
          </div>
          <div
            style={{ border: "1px solid #000" }}
            className="absolute left-1/2 top-[70%]  translate-x-[0px] translate-y-[140px] w-36 h-16 bg-white rounded-xl flex justify-between items-center gap-3 shadow-md z-20"
          >
            <img src="/img/home4.png" className=" ml-5 w-11 h-11 rounded-xl" />
            <div className="mr-2">
              <h3 className="text-xs text-gray-400">Giảng viên</h3>
              <h2 className="ml-1 text-lg font-bold text-[#000000]">100+</h2>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-center mt-10">
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
                  <CardHeader >
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
            className="mt-5 w-[80%] max-w-7xl mx-[10%]  "
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent className="-ml-6">
              {features.map((item, index) => {
                return (
                  <CarouselItem
                    key={index}
                    className="pl-6 basis-full sm:basis-1/2 lg:basis-1/4"
                  >
                    <Card className="group bg-white rounded-xl hover:bg-[#623715] hover:text-white transition h-full">
                      <img
                        src={item.imge}
                        className="w-full h-40 object-cover"
                      />
                      <CardHeader className="p-2">
                        <div className="flex flex-row items-center gap-5">
                          <CardTitle className="text-xl font-semibold line-clamp-1">
                            {item.title}
                          </CardTitle>
                        </div>

                        <CardDescription className="h-[60%] w-[60%]  text-gray-400 group-hover:text-gray-200 transition line-clamp-2">
                          {item.desc}
                        </CardDescription>
                        <CardDescription className="h-[60%] w-[60%]  text-gray-400 group-hover:text-gray-200 transition line-clamp-2 flex gap-1 items-center">
                          {item.rating}{" "}
                          <Star className="fill-yellow-400 text-yellow-400 size-4" />{" "}
                          ({item.reviewCount} đánh giá)
                        </CardDescription>
                        <CardFooter className="p-2">
                          <div className="w-full flex justify-between">
                            <a
                              className="underline text-center block text-[#785336] font-semibold hover:underline"
                              href="#"
                            >
                              Đọc tiếp
                            </a>
                            <div className="flex items-center">
                              <p className="text-sm text-gray-600 font-semibold">
                                2,534 lượt xem
                              </p>
                            </div>
                          </div>
                        </CardFooter>
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
        </div>
      </div>
      <div className="">
        <div>
          <h1 className="text-3xl font-bold text-center mt-10">
            Đội ngũ xây dựng Vistory
          </h1>
          <h2 className="text-xl text-gray-500 text-center mt-5">
            Giáo viên, biên tập viên lịch sử và đội ngũ công nghệ cùng tạo nên
            trải nghiệm học sử hiện đại.
          </h2>
          <div>
            {team.map((item, index) => {
              return (
                <div key={index} className="w-[20%] p-4 mt-10 inline-block">
                  <Card className=" bg-white rounded-xl  transition h-full flex flex-col items-center justify-center text-center">
                    <img
                      src={item.image}
                      className="mt-4 w-10 h-10 rounded-full object-cover"
                    />
                    <CardHeader className="flex flex-col items-center justify-center text-center">
                      <div className="flex flex-row items-center gap-5">
                        <CardTitle className="text-xl font-semibold line-clamp-1">
                          {item.name}
                        </CardTitle>
                      </div>

                      <CardDescription className="h-[60%] w-[60%]  text-gray-400 ">
                        {item.role}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-[#fff3e9]">
        <Carousel
          className="mt-5 w-[80%] max-w-7xl mx-[13%]  "
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-6">
            {features.map((item, index) => {
              return (
                <CarouselItem key={index} className=" basis-full  ">
                  <div className="flex flex-col items-center justify-center text-center">
                    <img src="/img/logo.png" className="w-40 h-40 " />
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
