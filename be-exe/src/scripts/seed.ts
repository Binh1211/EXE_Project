import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import {
  Chapter,
  FaqItem,
  FlashcardSet,
  Lesson,
  Quiz,
  User,
  UserLessonProgress,
} from "../models/index.js";
import { hashPassword } from "../utils/hash.js";

const VAN_LANG_CHAPTER_ID = "6a128cd2adb512d45cb30909";

type QuizOptionSeed = { id: mongoose.Types.ObjectId; text: string };

type LessonSeed = {
  order: number;
  title: string;
  description: string;
  isFree: boolean;
  video: {
    title: string;
    url: string;
    durationSec: number;
  };
  flashcards: { front: string; back: string }[];
  faqItems: { question: string; answer: string }[];
  quiz: {
    title: string;
    passingScore: number;
    questions: Array<{
      type: "mc" | "truefalse";
      text: string;
      options: QuizOptionSeed[];
      correctOptionId: mongoose.Types.ObjectId;
      explanation: string;
    }>;
  };
  progress?: {
    status: "unlocked" | "completed";
    videoWatchedPct: number;
    flashcardsViewed: boolean;
    quizBestScore: number;
    quizPassed: boolean;
    quizAttempts: number;
  };
};

const vanLangLessons: LessonSeed[] = [
  {
    order: 1,
    title: "Bài 1: Nguồn gốc người Lạc Việt",
    description:
      "Tìm hiểu nguồn gốc dân tộc, vùng đất sinh sống và quá trình hình thành cộng đồng người Lạc Việt trên đất nước ta.",
    isFree: true,
    video: {
      title: "Nguồn gốc người Lạc Việt và văn hóa sông nước",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSec: 720,
    },
    flashcards: [
      {
        front: "Lạc Việt",
        back: "Tổ tiên của người Việt, sinh sống chủ yếu ở vùng đồng bằng Bắc Bộ và ven sông Hồng.",
      },
      {
        front: "Văn minh sông nước",
        back: "Nền văn hóa gắn với trồng lúa nước, đan lát và đúc đồng Đông Sơn.",
      },
      {
        front: "Trống đồng Đông Sơn",
        back: "Di vật tiêu biểu thể hiện đẳng cấp xã hội và tín ngưỡng thời kỳ dựng nước.",
      },
    ],
    faqItems: [
      {
        question: "Người Lạc Việt sinh sống chủ yếu ở đâu?",
        answer:
          "Người Lạc Việt sinh sống chủ yếu ở vùng đồng bằng Bắc Bộ, ven sông Hồng và các vùng lân cận, phát triển nền văn hóa sông nước.",
      },
      {
        question: "Văn hóa Đông Sơn thể hiện điều gì?",
        answer:
          "Văn hóa Đông Sơn thể hiện trình độ rèn luyện đồng thủ công cao, tín ngưỡng thờ Mặt Trời và các biểu tượng chim Lạc, hình tượng quyền lực của bộ lạc.",
      },
      {
        question: "Vì sao nói Lạc Việt là cộng đồng sản xuất nông nghiệp?",
        answer:
          "Vì đời sống của họ gắn với trồng lúa nước, chăn nuôi, đan lát và tổ chức cộng đồng làng xã ổn định quanh các thủy lợi.",
      },
    ],
    quiz: {
      title: "Quiz: Nguồn gốc người Lạc Việt",
      passingScore: 70,
      questions: [
        {
          type: "mc",
          text: "Người Lạc Việt sinh sống chủ yếu ở vùng nào?",
          options: [
            { id: new mongoose.Types.ObjectId(), text: "Đồng bằng Bắc Bộ" },
            { id: new mongoose.Types.ObjectId(), text: "Cao nguyên Tây Nguyên" },
            { id: new mongoose.Types.ObjectId(), text: "Dãy núi Hoàng Liên Sơn" },
            { id: new mongoose.Types.ObjectId(), text: "Quần đảo Trường Sa" },
          ],
          correctOptionId: new mongoose.Types.ObjectId(),
          explanation: "Lạc Việt phát triển mạnh ở đồng bằng Bắc Bộ, ven sông Hồng.",
        },
      ],
    },
    progress: {
      status: "completed",
      videoWatchedPct: 100,
      flashcardsViewed: true,
      quizBestScore: 100,
      quizPassed: true,
      quizAttempts: 1,
    },
  },
  {
    order: 2,
    title: "Bài 2: Hùng Vương và nhà nước Văn Lang",
    description:
      "Khám phá truyền thuyết 18 đời Vua Hùng, cơ cấu nhà nước Văn Lang và vai trò của các bộ lạc.",
    isFree: true,
    video: {
      title: "Sự ra đời nhà nước Văn Lang dưới thời các Vua Hùng",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSec: 840,
    },
    flashcards: [
      {
        front: "Văn Lang",
        back: "Nhà nước sơ khai đầu tiên của người Việt, do các Vua Hùng lập nên.",
      },
      {
        front: "18 đời Vua Hùng",
        back: "Truyền thuyết về 18 đời vua cai trị, đặt kinh đô tại Phong Châu (Phú Thọ).",
      },
      {
        front: "Lạc hầu – Lạc tướng",
        back: "Tầng lớp quý tộc, quan lại giúp vua quản lý các bộ lạc và đất đai.",
      },
      {
        front: "Lang quan",
        back: "Người đứng đầu làng xã, quản lý dân cư và sản xuất địa phương.",
      },
    ],
    faqItems: [
      {
        question: "Nhà nước Văn Lang ra đời trong hoàn cảnh nào?",
        answer:
          "Văn Lang hình thành khi các bộ lạc Lạc Việt liên kết, cần một trung tâm quyền lực để điều hành đất đai, thủy lợi và quân sự.",
      },
      {
        question: "Kinh đô thời Vua Hùng thường được nhắc đến ở đâu?",
        answer:
          "Theo truyền thuyết, kinh đô đặt tại Phong Châu (nay thuộc huyện Thanh Ba, tỉnh Phú Thọ).",
      },
      {
        question: "Vai trò của Lạc hầu, Lạc tướng là gì?",
        answer:
          "Họ là tầng lớp quý tộc giúp vua quản lý các vùng, bộ lạc, thu thuế và huy động lực lượng khi cần.",
      },
      {
        question: "Mối quan hệ giữa Vua Hùng và các bộ lạc?",
        answer:
          "Vua Hùng đứng đầu liên minh các bộ lạc; các bộ vẫn giữ tập quán riêng nhưng chịu sự điều phối của trung ương.",
      },
    ],
    quiz: {
      title: "Quiz: Nhà nước Văn Lang",
      passingScore: 70,
      questions: [
        {
          type: "mc",
          text: "Nhà nước Văn Lang được cho là do ai sáng lập?",
          options: [
            { id: new mongoose.Types.ObjectId(), text: "Các Vua Hùng" },
            { id: new mongoose.Types.ObjectId(), text: "An Dương Vương" },
            { id: new mongoose.Types.ObjectId(), text: "Ngô Quyền" },
            { id: new mongoose.Types.ObjectId(), text: "Lý Thái Tổ" },
          ],
          correctOptionId: new mongoose.Types.ObjectId(),
          explanation: "Truyền thuyết kể về 18 đời Vua Hùng sáng lập nhà nước Văn Lang.",
        },
        {
          type: "truefalse",
          text: "Lang quan là người đứng đầu làng xã thời Văn Lang.",
          options: [
            { id: new mongoose.Types.ObjectId(), text: "Đúng" },
            { id: new mongoose.Types.ObjectId(), text: "Sai" },
          ],
          correctOptionId: new mongoose.Types.ObjectId(),
          explanation: "Lang quan quản lý dân cư và sản xuất ở cấp làng.",
        },
      ],
    },
    progress: {
      status: "unlocked",
      videoWatchedPct: 45,
      flashcardsViewed: false,
      quizBestScore: 0,
      quizPassed: false,
      quizAttempts: 0,
    },
  },
  {
    order: 3,
    title: "Bài 3: Đời sống kinh tế – xã hội thời Văn Lang",
    description:
      "Tìm hiểu nền kinh tế lúa nước, tổ chức xã hội, tín ngưỡng thờ cúng và lễ hội thời kỳ Văn Lang.",
    isFree: true,
    video: {
      title: "Đời sống kinh tế và sinh hoạt cộng đồng thời Văn Lang",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      durationSec: 900,
    },
    flashcards: [
      {
        front: "Trồng lúa nước",
        back: "Hình thức sản xuất chính, gắn với hệ thống đê đập và ruộng đồng.",
      },
      {
        front: "Giỗ Tổ Hùng Vương",
        back: "Lễ hội tưởng nhớ công lao dựng nước, thể hiện truyền thống uống nước nhớ nguồn.",
      },
      {
        front: "Tín ngưỡng thờ cúng",
        back: "Thờ thần linh sông nước, tổ tiên và các vị thần bảo vệ mùa màng.",
      },
    ],
    faqItems: [
      {
        question: "Nền kinh tế chính thời Văn Lang là gì?",
        answer:
          "Nền kinh tế nông nghiệp lúa nước kết hợp chăn nuôi, thủ công nghiệp đan lát, rèn đồng và đánh bắt ven sông.",
      },
      {
        question: "Giỗ Tổ Hùng Vương có ý nghĩa gì?",
        answer:
          "Là dịp cả dân tộc tưởng nhớ công lao dựng nước của các Vua Hùng, thể hiện đạo lý uống nước nhớ nguồn.",
      },
      {
        question: "Đời sống tinh thần của người Lạc Việt ra sao?",
        answer:
          "Họ có tín ngưỡng thờ thần linh, tổ tiên, tổ chức lễ hội mùa màng và các nghi lễ cộng đồng gắn với sản xuất.",
      },
    ],
    quiz: {
      title: "Quiz: Kinh tế – xã hội Văn Lang",
      passingScore: 80,
      questions: [
        {
          type: "mc",
          text: "Hoạt động sản xuất chính của người Lạc Việt là gì?",
          options: [
            { id: new mongoose.Types.ObjectId(), text: "Trồng lúa nước" },
            { id: new mongoose.Types.ObjectId(), text: "Buôn bán hàng hải" },
            { id: new mongoose.Types.ObjectId(), text: "Khai thác mỏ vàng" },
            { id: new mongoose.Types.ObjectId(), text: "Chăn nuôi bò sữa quy mô lớn" },
          ],
          correctOptionId: new mongoose.Types.ObjectId(),
          explanation: "Lạc Việt phát triển nền nông nghiệp lúa nước làm trụ cột kinh tế.",
        },
      ],
    },
  },
];

function buildQuizQuestions(questions: LessonSeed["quiz"]["questions"]) {
  return questions.map((q) => {
    const options = q.options.map((opt) => ({
      _id: opt.id,
      text: opt.text,
    }));
    const correctId =
      q.options.find((opt) => opt.id.equals(q.correctOptionId))?.id ??
      q.options[0].id;

    return {
      type: q.type,
      text: q.text,
      options,
      correctOptionId: correctId,
      explanation: q.explanation,
      points: 1,
    };
  });
}

async function ensureDemoUser() {
  const email = "demo@vistory.local";
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      passwordHash: await hashPassword("Demo@123"),
      displayName: "Học viên Demo",
      role: "user",
      level: 2,
      subscription: { status: "paid", plan: "level2" },
    });
    console.log("  ✅ Demo user:", email, "/ Demo@123");
  }
  return user;
}

async function seedVanLangChapter() {
  const chapterId = new mongoose.Types.ObjectId(VAN_LANG_CHAPTER_ID);
  const chapter = await Chapter.findById(chapterId);

  if (!chapter) {
    console.error(
      `❌ Không tìm thấy chapter id=${VAN_LANG_CHAPTER_ID}. Hãy tạo chapter "su-ra-doi-cua-van-lang" trước.`,
    );
    return;
  }

  console.log(`\n🌱 Seeding lessons cho: ${chapter.title}`);

  const demoUser = await ensureDemoUser();

  for (const item of vanLangLessons) {
    const quizQuestions = item.quiz.questions.map((q) => {
      const options = q.options.map((opt) => ({
        id: new mongoose.Types.ObjectId(),
        text: opt.text,
      }));
      return {
        ...q,
        options,
        correctOptionId: options[0].id,
      };
    });

    let lesson = await Lesson.findOne({
      chapterId,
      order: item.order,
    });

    if (!lesson) {
      lesson = await Lesson.create({
        chapterId,
        title: item.title,
        description: item.description,
        order: item.order,
        isFree: item.isFree,
        isPublished: true,
        videos: [
          {
            title: item.video.title,
            url: item.video.url,
            provider: "youtube",
            order: 1,
            durationSec: item.video.durationSec,
          },
        ],
      });
      console.log(`  ✅ Lesson: ${item.title}`);
    } else {
      lesson.title = item.title;
      lesson.description = item.description;
      lesson.isFree = item.isFree;
      lesson.isPublished = true;
      lesson.set("videos", [
        {
          title: item.video.title,
          url: item.video.url,
          provider: "youtube",
          order: 1,
          durationSec: item.video.durationSec,
        },
      ]);
      await lesson.save();
      console.log(`  ♻️  Cập nhật lesson: ${item.title}`);
    }

    const lessonId = lesson._id;

    // ── Quiz ──────────────────────────────────────────────────────────────────
    let quiz = await Quiz.findOne({ lessonId });
    if (!quiz) {
      quiz = await Quiz.create({
        lessonId,
        title: item.quiz.title,
        passingScore: item.quiz.passingScore,
        timeLimitSec: 600,
        questions: buildQuizQuestions(quizQuestions),
      });
    } else {
      quiz.title = item.quiz.title;
      quiz.passingScore = item.quiz.passingScore;
      quiz.questions = buildQuizQuestions(quizQuestions) as typeof quiz.questions;
      await quiz.save();
    }

    // ── Flashcard set ─────────────────────────────────────────────────────────
    let flashcardSet = await FlashcardSet.findOne({ lessonId });
    if (!flashcardSet) {
      flashcardSet = await FlashcardSet.create({
        lessonId,
        title: `Flashcard: ${item.title}`,
        cards: item.flashcards.map((card, index) => ({
          front: card.front,
          back: card.back,
          order: index + 1,
        })),
      });
    } else {
      flashcardSet.title = `Flashcard: ${item.title}`;
      flashcardSet.cards = item.flashcards.map((card, index) => ({
        front: card.front,
        back: card.back,
        order: index + 1,
      })) as typeof flashcardSet.cards;
      await flashcardSet.save();
    }

    // ── FAQ bot (nhiều FaqItem / lesson) ─────────────────────────────────────
    await FaqItem.deleteMany({ lessonId });

    const faqDocs = await FaqItem.insertMany(
      item.faqItems.map((faq, index) => ({
        lessonId,
        question: faq.question,
        answer: faq.answer,
        order: index + 1,
        isActive: true,
      })),
    );

    const firstFaq = faqDocs[0];

    // ── Liên kết lesson ───────────────────────────────────────────────────────
    lesson.quiz = quiz._id;
    lesson.flashcardSetId = flashcardSet._id;
    lesson.faqId = firstFaq?._id;
    await lesson.save();

    // ── User lesson progress ──────────────────────────────────────────────────
    if (item.progress) {
      await UserLessonProgress.findOneAndUpdate(
        { userId: demoUser._id, lessonId },
        {
          userId: demoUser._id,
          lessonId,
          status: item.progress.status,
          videoWatchedPct: item.progress.videoWatchedPct,
          videoCompletedAt:
            item.progress.videoWatchedPct >= 100 ? new Date() : undefined,
          flashcardsViewed: item.progress.flashcardsViewed,
          quizBestScore: item.progress.quizBestScore,
          quizPassed: item.progress.quizPassed,
          quizAttempts: item.progress.quizAttempts,
          completedAt:
            item.progress.status === "completed" ? new Date() : undefined,
        },
        { upsert: true, new: true },
      );
    } else {
      await UserLessonProgress.findOneAndUpdate(
        { userId: demoUser._id, lessonId },
        {
          userId: demoUser._id,
          lessonId,
          status: "locked",
          videoWatchedPct: 0,
          flashcardsViewed: false,
          quizBestScore: 0,
          quizPassed: false,
          quizAttempts: 0,
        },
        { upsert: true, new: true },
      );
    }

    console.log(
      `     → quiz, flashcard (${item.flashcards.length} thẻ), faq (${item.faqItems.length} câu)`,
    );
  }
}

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
    console.log("✅ Created admin:", adminEmail, "/ Admin@123");
  }

  await seedVanLangChapter();

  console.log("\n🎉 Seed completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
