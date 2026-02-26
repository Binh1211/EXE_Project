import { useState } from "react";
import { Link } from "react-router";
import { Menu, Search, X } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigator = useNavigate();
  return (
    <>
      <header className="sticky top-0 z-50 w-full  bg-[#fbf0ce]  backdrop-blur ">
        <div className=" px-6 mx-auto flex gap-7 h-20 items-center justify-between ">
          <div className="flex items-center gap-2">
            <img
              src="/img/logo.png"
              alt="EXE"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Mobile menu button */}
          {/* <button
            className="block md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button> */}

          <div className="bg-white rounded-xl flex items-center px-1 py-5 w-[40%] h-10 ">
            <Search className="w-4 h-4 ml-4 inline text-gray-400" />
            <input
              className="w-full focus:outline-none text-sm"
              type="text"
              placeholder={" Tìm kiếm khóa học..."}
            />
            <Select>
              <SelectTrigger
                className=" h-8
                            w-[25%]
                            rounded-xl
                            bg-[#fff3e9]
                            border-none
                            text-[#5f3713]
                            [&>span]:text-[#5f3713]
                            [&>span[data-placeholder]]:text-[#5f3713]"
              >
                <SelectValue placeholder="Khám phá" />
              </SelectTrigger>
              <SelectContent className="bg-[#fff3e9] text-[#5f3713] rounded-xl">
                <SelectGroup>
                  <SelectItem
                    className="data-[highlighted]:bg-[#f3e2d3] data-[highlighted]:border-l-2 border-[#623715]    rounded-xl"
                    value="light"
                  >
                    hehe
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-[#f3e2d3] data-[highlighted]:border-l-2 border-[#623715]    rounded-xl"
                    value="dark"
                  >
                    chua tay dau
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-[#f3e2d3] data-[highlighted]:border-l-2 border-[#623715]    rounded-xl"
                    value="system"
                  >
                    nà ná na na
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <div className="relative group inline-block">
              <button
                className="text-sm font-medium hover:text-[#5f3713]"
                onClick={() => navigator("/")}
              >
                Trang chủ
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-[#fff3e9] shadow-lg rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Về Vistory
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Thành phần
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Tính năng
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Lợi ích
                </a>
              </div>
            </div>
            <div className="relative group inline-block">
              <button
                className="text-sm font-medium hover:text-[#5f3713]"
                onClick={() => navigator("/")}
              >
                Khóa học
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-[#fff3e9] shadow-lg rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Kho học liệu
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Ôn thi
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Lớp học
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-[#f3e2d3] hover:border-l-2 border-[#623715] rounded-xl"
                >
                  Sách
                </a>
              </div>
            </div>
            <Link to="#" className="text-sm font-medium hover:text-[#5f3713]">
              Lộ trình học
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-[#5f3713]">
              Liên hệ
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-[#5f3713]">
              Tin tức
            </Link>
          </nav>
          <div className="flex gap-2">
            <Button className="w-24 text-sm shadow-none rounded-xl font-medium  text-black hover:text-[#5f3713] hover:rounded-xl">
              Đăng nhập
            </Button>
            <Button className="w-24 text-sm  rounded-xl font-medium bg-[#5f3713] text-white hover:scale-105 ring-0 hover:ring-2 hover:ring-[#f7f7f7] hover:bg-[#5f3713] hover:rounded-xl">
              Đăng ký
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
