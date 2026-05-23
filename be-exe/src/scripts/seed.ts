import "dotenv/config";
import { connectDatabase } from "../config/db.js";
import { Chapter, Lesson, User } from "../models/index.js";
import { hashPassword } from "../utils/hash.js";
import { Timeline } from "../models/Timeline.js";

const timelineData = [
  {
    slug: "van-lang-au-lac",
    title: "Thời kỳ dựng nước — Văn Lang & Âu Lạc",
    description:
      "Nhà nước đầu tiên của người Việt được hình thành dưới thời các Vua Hùng với tên gọi Văn Lang, sau đó là Âu Lạc dưới thời An Dương Vương. Đây là thời kỳ định hình bản sắc văn hóa Việt với trống đồng Đông Sơn, tín ngưỡng thờ cúng tổ tiên và nền nông nghiệp lúa nước.",
    imageUrl: "/img/VL_AL.png",
    displayTime: "2879 – 179 TCN",
  },
  {
    slug: "bac-thuoc-khang-chien",
    title: "Nghìn năm Bắc thuộc & các cuộc kháng chiến",
    description:
      "Sau khi Triệu Đà thôn tính Âu Lạc, người Việt trải qua hơn một nghìn năm dưới ách đô hộ của các triều đại phương Bắc. Trong suốt thời gian đó, tinh thần bất khuất không ngừng bùng cháy qua các cuộc khởi nghĩa của Hai Bà Trưng, Bà Triệu, Lý Bí và Khúc Thừa Dụ, giữ vững ngọn lửa ý thức dân tộc.",
    imageUrl: "/img/1000.jpg",
    displayTime: "179 TCN – 938",
  },
  {
    slug: "doc-lap-phong-kien",
    title: "Độc lập & phong kiến cực thịnh",
    description:
      "Chiến thắng Bạch Đằng năm 938 của Ngô Quyền mở ra kỷ nguyên độc lập tự chủ kéo dài gần mười thế kỷ. Các triều đại Đinh, Tiền Lê, Lý, Trần, Hồ, Lê, Mạc, Nguyễn nối tiếp nhau xây dựng và bảo vệ đất nước. Nhà Trần ba lần đánh bại quân Mông–Nguyên; nhà Lê sơ dưới thời Lê Thánh Tông đưa Đại Việt đến đỉnh cao thịnh trị và hoàn thành công cuộc mở cõi về phương Nam.",
    imageUrl: "/img/Thoi_binh.jpg",
    displayTime: "938 – 1858",
  },
  {
    slug: "phap-thuoc-giai-phong",
    title: "Thực dân Pháp & phong trào giải phóng dân tộc",
    description:
      "Thực dân Pháp nổ súng tấn công Đà Nẵng năm 1858, mở đầu quá trình xâm lược và biến Việt Nam thành thuộc địa. Phong trào yêu nước liên tiếp nổ ra: Cần Vương, Đông Du, Đông Kinh Nghĩa Thục... cho đến khi Nguyễn Ái Quốc tìm ra con đường cứu nước theo chủ nghĩa Mác–Lênin. Đỉnh điểm là Cách mạng Tháng Tám 1945 và bản Tuyên ngôn Độc lập ngày 2 tháng 9 năm 1945.",
    imageUrl: "/img/1945.jpg",
    displayTime: "1858 – 1945",
  },
  {
    slug: "khang-chien-thong-nhat",
    title: "Kháng chiến & thống nhất đất nước",
    description:
      "Ngay sau độc lập, Việt Nam bước vào hai cuộc kháng chiến trường kỳ. Chiến thắng Điện Biên Phủ năm 1954 buộc Pháp ký Hiệp định Genève, nhưng đất nước tạm thời bị chia cắt ở vĩ tuyến 17. Cuộc kháng chiến chống Mỹ tiếp diễn suốt 21 năm, kết thúc bằng đại thắng mùa Xuân 30 tháng 4 năm 1975 — non sông thu về một mối, Bắc Nam thống nhất.",
    imageUrl: "/img/thong nhat.jpg",
    displayTime: "1945 – 1975",
  },
];

async function seed() {
  await connectDatabase();

  // ── Users & Chapters ────────────────────────────────────────────────────────
  const adminEmail = "admin@vistory.local";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      email: adminEmail,
      passwordHash: await hashPassword("Admin@123"),
      displayName: "Admin Vistory",
      role: "admin",
      level: 3,
      subscription: { status: "paid", plan: "level3" },
    });
    console.log("✅ Created admin:", adminEmail, "/ Admin@123");
  }

  const chapterCount = await Chapter.countDocuments();
  if (chapterCount === 0) {
    const chapter = await Chapter.create({
      slug: "chuong-1-hue",
      title: "Chương 1: Kinh thành Huế",
      description: "Giới thiệu lịch sử triều Nguyễn",
      order: 1,
      requiredLevel: 1,
      isPublished: true,
    });

    await Lesson.insertMany([
      {
        chapterId: chapter._id,
        title: "Bài 1: Vị trí địa lý",
        order: 1,
        isFree: true,
        isPublished: true,
        xpReward: 10,
      },
      {
        chapterId: chapter._id,
        title: "Bài 2: Kiến trúc Hoàng thành",
        order: 2,
        isFree: true,
        isPublished: true,
        xpReward: 10,
      },
      {
        chapterId: chapter._id,
        title: "Bài 3: Đời sống cung đình",
        order: 3,
        isFree: false,
        isPublished: true,
        xpReward: 15,
      },
    ]);

    console.log("✅ Seeded sample chapter + lessons");
  }

  // ── Timeline ─────────────────────────────────────────────────────────────────
  console.log("\n🌱 Seeding timeline...");
  for (const item of timelineData) {
    await Timeline.findOneAndUpdate({ slug: item.slug }, item, {
      upsert: true,
      new: true,
    });
    console.log(`  ✅ ${item.title}`);
  }

  console.log("\n🎉 Seed completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});