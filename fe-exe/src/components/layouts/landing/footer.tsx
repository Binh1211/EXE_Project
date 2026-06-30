import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Facebook, Github, Youtube } from "lucide-react";
import { IMG } from "@/lib/images";

function Footer() {
  return (
    <footer className="bg-[#281510] py-12 mt-12">
      <div className="text-white max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-6 sm:px-8 md:px-12">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <img className="w-20 h-20" src={IMG.logoWhite} alt="Logo" />
          <p className="text-white text-sm">
            Học qua bài giảng ngắn gọn, minigame và hệ thống ôn tập thông minh —
            giúp ghi nhớ dễ hơn, hiểu sâu hơn.
          </p>
        </div>
        <div className="flex flex-col gap-2">
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
        </div>
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
          <h6 className="text-[#8C95A5] font-semibold text-sm">Cộng đồng</h6>
          <Link to="https://www.facebook.com/profile.php?id=61590310663710" className="text-sm font-medium hover:text-primary">
            Facebook
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Github
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            YouTube
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h6 className="text-[#8C95A5] font-semibold text-sm">Pháp lý</h6>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Điều khoản sử dụng
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary">
            Chính sách bảo mật
          </Link>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <p className="text-[#8C95A5] font-semibold text-sm">&copy; {new Date().getFullYear()} Vistory. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="https://www.facebook.com/profile.php?id=61590310663710" className="text-sm font-medium hover:text-primary">
              <Facebook className="rounded-full bg-white p-1 text-[#281510] w-8 h-8" />
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-primary">
              <Github className="rounded-full bg-white p-1 text-[#281510] w-8 h-8" />
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-primary">
              <Youtube className="rounded-full bg-white p-1 text-[#281510] w-8 h-8" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;