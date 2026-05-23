import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const vipPlans = [
  {
    level: "VIP Cơ bản",
    price: 0,
    duration: "Mãi mãi",
    description: "Truy cập nội dung cơ bản, trải nghiệm học tập chuẩn.",
    features: [
      "Các bài học miễn phí",
      "Thực hành cơ bản",
      "Tham gia cộng đồng",
    ],
    badge: "Cơ bản",
    planId: "free",
  },
  {
    level: "VIP Nâng cao",
    price: 249000,
    duration: "90 ngày",
    description: "Tăng tốc học tập với quyền truy cập đầy đủ, bộ đề luyện chuyên sâu và ưu đãi sự kiện.",
    features: [
      "Tất cả ưu đãi VIP Cơ bản",
      "Mở khoá tất cả bài học (Level 2)",
      "Truy cập khoá học đặc biệt",
    ],
    badge: "Phổ biến",
    planId: "level2",
  },
  {
    level: "VIP Cao cấp",
    price: 399000,
    duration: "180 ngày",
    description: "Trải nghiệm VIP toàn diện, kèm mentor, chứng chỉ và quà tặng độc quyền.",
    features: [
      "Tất cả ưu đãi VIP Nâng cao",
      "Tạo phòng Group thi đua (Level 3)",
      "Quà tặng và badge độc quyền",
    ],
    badge: "Hot",
    planId: "level3",
  },
];

function formatVnd(value: number) {
  return value.toLocaleString("vi-VN");
}

export default function VipPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthUser();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuy = async (planName: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setMessage(`Yêu cầu mua ${planName} đã được gửi. Mở lại sau để hoàn tất thanh toán.`);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="py-20 px-5 md:px-12 bg-[#fff7e9] min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#b36b2c]">
            Gói VIP
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#2d1b09]">
            Chọn cấp VIP phù hợp với hành trình học của bạn
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-[#6b533f]">
            3 cấp độ VIP để bạn tiếp cận nội dung đặc quyền, hỗ trợ nhanh và trải nghiệm học tập chuyên nghiệp.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {vipPlans.map((plan) => (
            <Card key={plan.level} className="border-[#f3d4a5] bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-xl">{plan.level}</CardTitle>
                  <span className="rounded-full bg-[#fbedd6] px-3 py-1 text-xs font-semibold text-[#a35b1f]">
                    {plan.badge}
                  </span>
                </div>
                <CardDescription>{plan.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-5 text-sm text-[#5f4331]">{plan.description}</p>
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="rounded-2xl bg-[#fff3e6] px-4 py-3 text-sm text-[#4b3420]">
                      • {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="text-3xl font-bold text-[#4d2c0d]">
                  {formatVnd(plan.price)} VND
                </div>
                {plan.planId === "free" ? (
                  <Button
                    className="w-full bg-[#e6d0b3] text-[#4d2c0d] hover:bg-[#d4be9e]"
                    disabled={true}
                  >
                    {isLoggedIn ? "Đang sử dụng" : "Mặc định"}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-[#b9712f] text-white hover:bg-[#a15d28]"
                    onClick={() => handleBuy(plan.level)}
                    disabled={loading}
                  >
                    {isLoggedIn ? "Mua ngay" : "Đăng nhập để mua"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {message ? (
          <div className="mt-8 rounded-3xl border border-[#f3d4a5] bg-[#fff4dc] p-6 text-center text-[#6b4d33] shadow-sm">
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
