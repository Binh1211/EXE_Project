import "dotenv/config";
import { connectDatabase } from "../config/db.js";
import { Chapter, Lesson, User } from "../models/index.js";
import { hashPassword } from "../utils/hash.js";

async function seed() {
  await connectDatabase();

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
    console.log("Created admin:", adminEmail, "/ Admin@123");
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

    console.log("Seeded sample chapter + lessons");
  }

  console.log("Seed completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
