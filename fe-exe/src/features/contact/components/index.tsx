import FloatingInput from "@/components/ui/FloatingInput";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

function ContactContent() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    note: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
  });

  const handleNameBlur = () => {
    setTouched((prev) => ({ ...prev, fullName: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
  };

  useEffect(() => {
    if (touched.email) {
      if (!formData.email) {
        setErrors((prev) => ({
          ...prev,
          email: "Email không được để trống",
        }));
      } else if (!validateEmail(formData.email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email không đúng định dạng",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }
    if (touched.fullName) {
      if (!formData.fullName) {
        setErrors((prev) => ({
          ...prev,
          fullName: "Họ và tên không được để trống",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          fullName: "",
        }));
      }
    }
  }, [formData.email, touched.email, formData.fullName, touched.fullName]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email không đúng định dạng",
      }));
      return;
    }

    console.log("Form OK:", formData);
  }

  return (
    <div className="bg-white py-14 mt-10 mx-[15%] rounded-xl">
      <h1 className="text-4xl font-bold text-[#785336] text-center">
        Liên hệ với Vistory
      </h1>
      <p className="text-center text-[#623715] mt-2 text-base font-normal">
        Bạn có câu hỏi về khóa học, lộ trình học hay muốn demo cho lớp học?
        <br />
        Hãy để lại lời nhắn — đội ngũ Vistory sẽ phản hồi trong vòng 24 giờ.
      </p>
      <div className="text-center border-t border-[#623715] border-2 rounded-xl mx-[39%] mt-3"></div>
      <h4 className="text-2xl font-semibold text-[#785336] text-left mt-6 ml-[10%]">
        Gửi tin nhắn cho chúng tôi
      </h4>
      <div className="grid grid-cols-2 gap-2 mt-6 mx-[10%]">
        <div>
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <FloatingInput
              id="fullName"
              name="fullName"
              label="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleNameBlur}
              error={errors.fullName}
              required
            />

            <FloatingInput
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              error={errors.email}
              required
            />

            <div>
              <textarea
                name="note"
                rows={5}
                placeholder="Bạn đang quan tâm đến khóa học nào?
Hoặc hãy cho chúng tôi biết nhu cầu của bạn..."
                value={formData.note}
                onChange={handleChange}
                className="w-full resize-none rounded-md border border-gray-400 bg-white px-4 py-3 outline-none focus:border-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#7A4317] py-3 text-white text-lg font-semibold hover:opacity-90 transition"
            >
              Gửi tin nhắn
            </button>

            <p className="text-center text-sm italic text-[#7A4317]">
              Vistory cam kết bảo mật thông tin của bạn.
            </p>
          </form>
        </div>
        <div className="flex-1 ml-[20%]">
          <p className="text-black text-lg font-normal mb-4">
            Vistory — Nền tảng học Lịch sử Việt Nam
            <br />
            Tầng X, Đại học FPT, Quận Ngũ Hàng Sơn, TP. Đà Nẵng
          </p>
          <p className="text-black text-lg font-normal mb-4">+84 123 456 789</p>
          <p className="text-black text-lg font-normal mb-4">
            support@vistory.vn
          </p>
          <div className="flex gap-6 mt-4 mb-3">
            <Link to="#">
              <Youtube className="size-10 p-1 text-black" />
            </Link>
            <Link to="#">
              <Instagram className="size-10 p-1 text-black" />
            </Link>
            <Link to="#">
              <Facebook className="size-10 p-1 text-black" />
            </Link>
          </div>
          <a
            href="https://maps.app.goo.gl/HY39NgXQ2K6b6yiP7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="img/address_pic.png" alt="address" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactContent;
