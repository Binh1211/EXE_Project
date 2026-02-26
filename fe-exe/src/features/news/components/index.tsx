import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock4, Eye } from "lucide-react";

function NewsContent() {
  return (
    <div>
      <div className="grid grid-cols-2 w-full bg-[#EED4B1] py-14 mt-6">
        <div className="ml-[15%] pr-[20%]">
          <h4 className="text-black text-lg">Tin tức & Giáo dục</h4>
          <h1 className="text-4xl font-bold text-[#785336] mt-4">
            Lịch sử Việt Nam trong thời đại số; Vì sao học qua tương tác giúp
            ghi nhớ lâu hơn?
          </h1>
          <p className="text-base text-black mt-6 text-wrap">
            Giáo dục lịch sử đang chuyển mình mạnh mẽ với công nghệ. Bài học
            trực quan, minigame và hệ thống ôn tập thông minh giúp học sinh hiểu
            bản chất sự kiện thay vì học thuộc lòng.
          </p>
          <Button className="mt-6 bg-[#623715] text-white hover:bg-[#623715]/90 rounded-xl text-lg px-10 py-4">
            Đọc bài viết
          </Button>
        </div>
        <div className="mr-[15%]">
          <img
            src="/img/news1.png"
            alt="EXE"
            className="w-auto object-contain"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 mt-12 gap-10">
        <h4 className="text-black text-2xl font-semibold ml-[15%]">
          Bài viết nổi bật
        </h4>
        <a
          href="#"
          className="text-[#785336] text-lg font-semibold mr-[15%] underline text-right"
        >
          (Xem tất cả)
        </a>
        <div className="col-span-2 flex justify-between gap-10 mx-[7%]">
          <Card className="bg-white rounded-xl flex flex-col h-full w-[32%]">
            <img
              src="img/news2.png"
              className="h-[40%] w-full object-cover p-4 pb-0"
            />

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-semibold mb-2 line-clamp-2">
                Vistory ra mắt hệ thống minigame lịch sử mới
              </CardTitle>

              <p className="text-base font-medium line-clamp-1">
                Tác giả: Vistory Team
              </p>

              <CardDescription className="text-base text-gray-600 mt-4 line-clamp-3">
                Vistory chính thức cập nhật chuỗi minigame theo từng giai đoạn
                lịch sử, giúp học sinh luyện tập mốc thời gian và nhân vật quan
                trọng.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-between">
                <a
                  className="underline text-center block text-[#785336] font-semibold hover:underline"
                  href="#"
                >
                  Đọc tiếp
                </a>
                <div className="flex items-center">
                  <Eye className="inline mr-2 text-[#623715]" />
                  <p className="text-sm text-gray-600 font-semibold">
                    2,534 lượt xem
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-white rounded-xl flex flex-col h-full w-[32%]">
            <img
              src="img/news3.png"
              className="h-[40%] w-full object-cover p-4 pb-0"
            />

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-semibold mb-2 line-clamp-2">
                Xu hướng học lịch sử qua nền tảng số năm 2026
              </CardTitle>

              <p className="text-base font-medium line-clamp-1">
                Tác giả: Vistory Team
              </p>

              <CardDescription className="text-base text-gray-600 mt-4 line-clamp-3">
                Các trường học và CLB đang tích cực ứng dụng nền tảng e-learning
                để đổi mới cách tiếp cận môn Lịch sử.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-between">
                <a
                  className="underline text-center block text-[#785336] font-semibold hover:underline"
                  href="#"
                >
                  Đọc tiếp
                </a>
                <div className="flex items-center">
                  <Eye className="inline mr-2 text-[#623715]" />
                  <p className="text-sm text-gray-600 font-semibold">
                    2,534 lượt xem
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-white rounded-xl flex flex-col h-full w-[32%]">
            <img
              src="img/news1.png"
              className="h-[40%] w-full object-cover p-4 pb-0"
            />

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-semibold mb-2 line-clamp-2">
                Vistory ra mắt hệ thống minigame lịch sử mới
              </CardTitle>

              <p className="text-base line-clamp-1 font-medium">
                Tác giả: Vistory Team
              </p>

              <CardDescription className="text-base text-gray-600 mt-4 line-clamp-3">
                Vistory chính thức cập nhật chuỗi minigame theo từng giai đoạn
                lịch sử Vistory chính thức cập nhật chuỗi minigame theo từng
                giai đoạn lịch sử
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-between">
                <a
                  className="underline text-center block text-[#785336] font-semibold hover:underline"
                  href="#"
                >
                  Đọc tiếp
                </a>
                <div className="flex items-center">
                  <Eye className="inline mr-2 text-[#623715]" />
                  <p className="text-sm text-gray-600 font-semibold">
                    2,534 lượt xem
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <h4 className="text-black text-2xl font-semibold ml-[15%] mt-2">
          Tin chuyên đề
        </h4>
        <a
          href="#"
          className="text-[#785336] text-lg font-semibold mr-[15%] underline text-right mt-2"
        >
          (Xem tất cả)
        </a>
        <div className="col-span-2 flex justify-between gap-10 mx-[7%] mb-6">
          <Card className="bg-white rounded-xl flex flex-col h-full w-[23%]">
            <img
              src="img/news1.png"
              className="h-[40%] w-full object-cover p-4 pb-0"
            />

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-semibold mb-2 line-clamp-2">
                Vistory ra mắt hệ thống minigame lịch sử mới
              </CardTitle>

              <p className="text-base line-clamp-1 font-medium">
                Tác giả: Vistory Team
              </p>

              <CardDescription className="text-base text-gray-600 mt-4 line-clamp-3">
                Vistory chính thức cập nhật chuỗi minigame theo từng giai đoạn
                lịch sử Vistory chính thức cập nhật chuỗi minigame theo từng
                giai đoạn lịch sử
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-between">
                <a
                  className="underline text-center block text-[#785336] font-semibold hover:underline"
                  href="#"
                >
                  Đọc tiếp
                </a>
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-white rounded-xl flex flex-col h-full w-[23%]">
            <img
              src="img/news1.png"
              className="h-[40%] w-full object-cover p-4 pb-0"
            />

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-semibold mb-2 line-clamp-2">
                Vistory ra mắt hệ thống minigame lịch sử mới
              </CardTitle>

              <p className="text-base line-clamp-1 font-medium">
                Tác giả: Vistory Team
              </p>

              <CardDescription className="text-base text-gray-600 mt-4 line-clamp-3">
                Vistory chính thức cập nhật chuỗi minigame theo từng giai đoạn
                lịch sử Vistory chính thức cập nhật chuỗi minigame theo từng
                giai đoạn lịch sử
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-between">
                <a
                  className="underline text-center block text-[#785336] font-semibold hover:underline"
                  href="#"
                >
                  Đọc tiếp
                </a>
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-white rounded-xl flex flex-col h-full w-[23%]">
            <img
              src="img/news1.png"
              className="h-[40%] w-full object-cover p-4 pb-0"
            />

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-semibold mb-2 line-clamp-2">
                Vistory ra mắt hệ thống minigame lịch sử mới
              </CardTitle>

              <p className="text-base line-clamp-1 font-medium">
                Tác giả: Vistory Team
              </p>

              <CardDescription className="text-base text-gray-600 mt-4 line-clamp-3">
                Vistory chính thức cập nhật chuỗi minigame theo từng giai đoạn
                lịch sử Vistory chính thức cập nhật chuỗi minigame theo từng
                giai đoạn lịch sử
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-between">
                <a
                  className="underline text-center block text-[#785336] font-semibold hover:underline"
                  href="#"
                >
                  Đọc tiếp
                </a>
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-white rounded-xl flex flex-col h-full w-[23%]">
            <img
              src="img/news1.png"
              className="h-[40%] w-full object-cover p-4 pb-0"
            />

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-semibold mb-2 line-clamp-2">
                Vistory ra mắt hệ thống minigame lịch sử mới
              </CardTitle>

              <p className="text-base line-clamp-1 font-medium">
                Tác giả: Vistory Team
              </p>

              <CardDescription className="text-base text-gray-600 mt-4 line-clamp-3">
                hính thức cập nhật chuỗi minigame theo từng
                giai đoạn lịch sử
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="w-full flex justify-between">
                <a
                  className="underline text-center block text-[#785336] font-semibold hover:underline"
                  href="#"
                >
                  Đọc tiếp
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default NewsContent;
