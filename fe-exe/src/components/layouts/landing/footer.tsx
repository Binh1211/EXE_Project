import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Facebook, Github, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#281510] h-[50vh] py-16 mt-20">
      <div className="text-white grid grid-cols-6 gap-8 px-[15%] mb-20">
        <div className="col-span-2 flex flex-col gap-6 mr-14">
          <img className="w-20 h-20" src="/img/logo_white.png" alt="Logo" />
          <p className="text-white text-sm text-wrap">
            Học qua bài giảng ngắn gọn, minigame và hệ thống ôn tập thông minh —
            giúp ghi nhớ dễ hơn, hiểu sâu hơn.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h6 className="text-[#8C95A5] font-semibold text-sm">Sản phẩm</h6>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Tổng quan
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Khóa học
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Minigame
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Lộ trình học
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Bảng giá
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h6 className="text-[#8C95A5] font-semibold text-sm">Về Vistory</h6>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Giới thiệu
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Đội ngũ
          </Link>
          <div className="flex items-center gap-1">
            <Link to="#" className="text-sm font-medium hover:text-primary">
              Tuyển dụng
            </Link>
            <Badge className="bg-white text-black ml-1">New</Badge>
          </div>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Tin tức
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h6 className="text-[#8C95A5] font-semibold text-sm">Cộng đồng</h6>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Facebook
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Github
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            YouTube
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            TikTok
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h6 className="text-[#8C95A5] font-semibold text-sm">Pháp lý</h6>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Điều khoản sử dụng
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Chính sách bảo mật
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Chính sách cookie
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            FAQs
          </Link>
        </div>
        <div className="mt-4 col-span-5">
          <p className="text-[#8C95A5] font-semibold text-base">
            &copy; {new Date().getFullYear()} Vistory. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 mt-4">
          <Link to="#" className="text-sm font-medium hover:text-primary">
            <Facebook className="rounded-full bg-white size-8 p-1 text-[#281510]"/>
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            <Github className="rounded-full bg-white size-8 p-1 text-[#281510]"/>
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            <Youtube className="rounded-full bg-white size-8 p-1 text-[#281510]"/>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
