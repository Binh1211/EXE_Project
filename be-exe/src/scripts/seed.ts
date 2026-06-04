import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import {
  Chapter,
  Mindmap,
  FlashcardSet,
  Lesson,
  Quiz,
  Timeline,
  User,
  UserLessonProgress,
} from "../models/index.js";
import { hashPassword } from "../utils/hash.js";

function buildSampleMindmap(lessonTitle: string) {
  const titleLower = lessonTitle.toLowerCase();
  if (titleLower.includes("cách mạng tháng tám") || titleLower.includes("1945") || titleLower.includes("bài 6") || titleLower.includes("bai 6")) {
    return [
      {
        title: "I. Bối cảnh lịch sử",
        layoutType: "rect",
        topics: [
          {
            title: "1. Tình hình thế giới",
            illustrationUrl: "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492406/vistory/I_1.png",
            items: [
              {
                content: "Chiến tranh thế giới thứ hai bước vào giai đoạn kết thúc: Đức bại trận ở châu Âu, Nhật chuẩn bị đầu hàng Đồng minh vô điều kiện."
              }
            ]
          },
          {
            title: "2. Tình hình Việt Nam",
            illustrationUrl: "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492407/vistory/I_2.png",
            items: [
              {
                content: "Chính quyền Nhật ở Việt Nam hoang mang dao động cực độ, nhân dân sục sôi khí thế cách mạng, sẵn sàng đứng lên khởi nghĩa."
              }
            ]
          },
          {
            title: "3. Chủ trương trung ương Đảng",
            illustrationUrl: "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492408/vistory/I_3.png",
            items: [
              {
                content: "Hội nghị toàn quốc của Đảng tại Tân Trào họp từ 13-15/8/1945 quyết định phát động Tổng khởi nghĩa giành chính quyền trong cả nước."
              }
            ]
          }
        ]
      },
      {
        title: "II. Diễn biến chính của cách mạng tháng Tám",
        layoutType: "scroll",
        topics: [
          {
            title: "Khởi nghĩa giành chính quyền ở các đô thị lớn",
            illustrationUrl: "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492409/vistory/II.png",
            items: [
              {
                content: "Tổng khởi nghĩa nổ ra và giành thắng lợi rực rỡ: 19/8 tại Hà Nội, 23/8 tại Huế, 25/8 tại Sài Gòn. Ngày 2/9/1945 Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa."
              }
            ]
          }
        ]
      },
      {
        title: "III. Nguyên nhân thắng lợi, ý nghĩa lịch sử và bài học kinh nghiệm",
        layoutType: "rect",
        topics: [
          {
            title: "1. Nguyên nhân thắng lợi:",
            illustrationUrl: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595644/vistory/home1.png",
            items: [
              {
                label: "a. Chủ quan",
                content: "Sự lãnh đạo đúng đắn, sáng suốt của Đảng đứng đầu là Chủ tịch Hồ Chí Minh; tinh thần đoàn kết, yêu nước nồng nàn của nhân dân Việt Nam."
              },
              {
                label: "b. Khách quan",
                content: "Hồng quân Liên Xô và lực lượng Đồng minh đánh bại phát xít Đức, quân phiệt Nhật, tạo điều kiện thuận lợi ngàn năm có một cho dân tộc ta."
              }
            ]
          },
          {
            title: "2. Ý nghĩa lịch sử:",
            illustrationUrl: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595642/vistory/VL_AL.png",
            items: [
              {
                label: "a. Đối với Việt Nam",
                content: "Mở ra bước ngoặt vĩ đại, phá tan xiềng xích nô lệ của Pháp-Nhật, lật đổ chế độ quân chủ phong kiến, lập ra nước Việt Nam Dân chủ Cộng hòa."
              },
              {
                label: "b. Đối với thế giới",
                content: "Chọc thủng khâu yếu nhất trong hệ thống thuộc địa của chủ nghĩa đế quốc, cổ vũ mạnh mẽ phong trào giải phóng dân tộc toàn thế giới."
              }
            ]
          },
          {
            title: "3. Bài học kinh nghiệm:",
            illustrationUrl: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595641/vistory/Thoi_binh.jpg",
            items: [
              {
                label: "Đảng lãnh đạo",
                content: "Đảng phải có đường lối cách mạng đúng đắn, giương cao ngọn cờ giải phóng dân tộc và nắm bắt thời cơ khởi nghĩa chính xác."
              },
              {
                label: "Khối liên minh",
                content: "Xây dựng khối liên minh công nông vững chắc, đoàn kết mọi lực lượng yêu nước trong Mặt trận Việt Minh để tạo sức mạnh tổng hợp."
              }
            ]
          }
        ]
      }
    ];
  }

  return [
    {
      title: "I. Khái quát chung",
      layoutType: "rect",
      topics: [
        {
          title: "1. Bối cảnh hình thành",
          items: [
            {
              content: `Hoàn cảnh lịch sử và điều kiện kinh tế - xã hội cụ thể thúc đẩy sự hình thành và phát triển của chủ đề: ${lessonTitle}.`
            }
          ]
        },
        {
          title: "2. Đặc điểm nổi bật",
          items: [
            {
              content: `Những nét đặc trưng độc đáo, cốt lõi nhất tạo nên giá trị và bản sắc lịch sử của thời kỳ/sự kiện: ${lessonTitle}.`
            }
          ]
        }
      ]
    },
    {
      title: "II. Nội dung chính & Các giai đoạn phát triển",
      layoutType: "scroll",
      topics: [
        {
          title: "Tiến trình diễn biến lịch sử",
          items: [
            {
              content: `Mô tả chi tiết quá trình phát triển qua các giai đoạn, các mốc sự kiện tiêu biểu và vai trò của các nhân vật chủ chốt trong: ${lessonTitle}.`
            }
          ]
        }
      ]
    },
    {
      title: "III. Giá trị & Ý nghĩa lịch sử lâu dài",
      layoutType: "rect",
      topics: [
        {
          title: "1. Kết quả & Tác động",
          items: [
            {
              label: "a. Đối với thời kỳ đó",
              content: "Giải quyết các mâu thuẫn xã hội, củng cố nền độc lập tự chủ hoặc thúc đẩy giao thương, văn hóa phát triển vượt bậc."
            },
            {
              label: "b. Đối với hậu thế",
              content: "Để lại những di sản văn hóa vật thể, phi vật thể giá trị và bài học quý báu cho công cuộc dựng nước và giữ nước ngày nay."
            }
          ]
        },
        {
          title: "2. Bài học kinh nghiệm cốt lõi",
          items: [
            {
              label: "Chính trị & Quân sự",
              content: "Bài học về sự đồng lòng nhất trí của nhân dân, tính linh hoạt và chủ động trong nghệ thuật tự chủ quốc gia."
            },
            {
              label: "Kinh tế & Văn hóa",
              content: "Bài học về phát triển sức sản xuất, củng cố nội lực kinh tế và gìn giữ truyền thống bản sắc văn hóa dân tộc."
            }
          ]
        }
      ]
    }
  ];
}

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

const class10Lessons: LessonSeed[] = [
  { order: 1, title: "Bài 1: Hiện thực lịch sử và nhận thức lịch sử", description: "Khái quát về thực tại lịch sử và cách thức con người nhận thức lịch sử.", isFree: true, video: { title: "Hiện thực lịch sử", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 600 }, flashcards: [{ front: "Lịch sử", back: "Ghi chép, nghiên cứu các sự kiện trong quá khứ." }], faqItems: [{ question: "Lịch sử là gì?", answer: "Là sự ghi chép và nghiên cứu về các sự kiện trong quá khứ." }], quiz: { title: "Quiz Bài 1", passingScore: 60, questions: [{ type: "mc", text: "Lịch sử nghiên cứu điều gì?", options: [{ id: new mongoose.Types.ObjectId(), text: "Sự kiện quá khứ" }, { id: new mongoose.Types.ObjectId(), text: "Tương lai" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Lịch sử nghiên cứu quá khứ." }] } },
  { order: 2, title: "Bài 2: Tri thức lịch sử và cuộc sống", description: "Vai trò của tri thức lịch sử trong đời sống con người và xã hội.", isFree: true, video: { title: "Tri thức lịch sử", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 480 }, flashcards: [{ front: "Tri thức lịch sử", back: "Những hiểu biết về quá khứ giúp định hướng hiện tại." }], faqItems: [{ question: "Tri thức lịch sử có ích gì?", answer: "Giúp rút kinh nghiệm, hiểu bản sắc dân tộc và định hướng tương lai." }], quiz: { title: "Quiz Bài 2", passingScore: 60, questions: [{ type: "mc", text: "Tri thức lịch sử giúp gì?", options: [{ id: new mongoose.Types.ObjectId(), text: "Rút kinh nghiệm" }, { id: new mongoose.Types.ObjectId(), text: "Làm giàu nhanh" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Tri thức lịch sử giúp rút kinh nghiệm." }] } },
  { order: 3, title: "Bài 3: Sử học với các lĩnh vực khoa học", description: "Mối liên hệ giữa sử học và các ngành khoa học khác.", isFree: true, video: { title: "Sử học và khoa học", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 540 }, flashcards: [{ front: "Sử học", back: "Ngành nghiên cứu quá khứ liên kết với nhân chủng học, khảo cổ..." }], faqItems: [{ question: "Sử học liên quan đến ngành nào?", answer: "Khảo cổ học, nhân chủng học, địa lý lịch sử..." }], quiz: { title: "Quiz Bài 3", passingScore: 60, questions: [{ type: "mc", text: "Sử học liên kết với ngành nào?", options: [{ id: new mongoose.Types.ObjectId(), text: "Khảo cổ" }, { id: new mongoose.Types.ObjectId(), text: "Vật lý lượng tử" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Sử học liên kết với khảo cổ." }] } },
  { order: 4, title: "Bài 4: Sử học với một số lĩnh vực, ngành nghề hiện đại", description: "Ứng dụng kiến thức lịch sử trong nghề nghiệp hiện đại.", isFree: true, video: { title: "Sử học ứng dụng", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 420 }, flashcards: [{ front: "Ứng dụng sử học", back: "Trong luật, văn hóa, du lịch, giáo dục." }], faqItems: [{ question: "Sử học ứng dụng ở đâu?", answer: "Giáo dục, bảo tàng, di sản văn hóa, du lịch." }], quiz: { title: "Quiz Bài 4", passingScore: 60, questions: [{ type: "mc", text: "Sử học ứng dụng trong lĩnh vực nào?", options: [{ id: new mongoose.Types.ObjectId(), text: "Du lịch" }, { id: new mongoose.Types.ObjectId(), text: "Lắp ráp ô tô" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Du lịch và bảo tàng sử dụng kiến thức lịch sử." }] } },
  { order: 5, title: "Bài 5: Khái niệm văn minh. Một số nền văn minh phương Đông thời kì cổ - trung đại", description: "Khái niệm văn minh và ví dụ về các nền văn minh phương Đông cổ - trung đại.", isFree: true, video: { title: "Văn minh phương Đông", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 660 }, flashcards: [{ front: "Văn minh", back: "Hệ thống tập quán, kỹ thuật, tổ chức xã hội cao cấp." }], faqItems: [{ question: "Văn minh là gì?", answer: "Là mức độ phát triển cao của xã hội với chữ viết, nhà nước, công nghệ." }], quiz: { title: "Quiz Bài 5", passingScore: 70, questions: [{ type: "mc", text: "Đặc trưng của văn minh?", options: [{ id: new mongoose.Types.ObjectId(), text: "Chữ viết" }, { id: new mongoose.Types.ObjectId(), text: "Không có công nghệ" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Chữ viết là một đặc trưng của văn minh." }] } },
  { order: 6, title: "Bài 6: Một số nền văn minh phương Tây thời kì cổ - trung đại", description: "Tổng quan về nền văn minh phương Tây cổ - trung đại và ảnh hưởng của nó.", isFree: true, video: { title: "Văn minh phương Tây", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 660 }, flashcards: [{ front: "Văn minh phương Tây", back: "Hy Lạp, La Mã và truyền thống pháp luật, văn học." }], faqItems: [{ question: "Nền văn minh La Mã có đặc điểm gì?", answer: "Luật pháp, kỹ thuật xây dựng, hệ thống hành chính phát triển." }], quiz: { title: "Quiz Bài 6", passingScore: 70, questions: [{ type: "mc", text: "Nền văn minh nào xây dựng hệ thống luật pháp ảnh hưởng tới châu Âu?", options: [{ id: new mongoose.Types.ObjectId(), text: "La Mã" }, { id: new mongoose.Types.ObjectId(), text: "Inca" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "La Mã có ảnh hưởng lớn đến luật pháp châu Âu." }] } },
  { order: 7, title: "Bài 7: Các cuộc cách mạng công nghiệp thời kì cận đại", description: "Nguyên nhân, diễn biến và hệ quả của cuộc Cách mạng Công nghiệp giai đoạn cận đại.", isFree: true, video: { title: "Cách mạng công nghiệp", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 720 }, flashcards: [{ front: "Cách mạng công nghiệp", back: "Sự chuyển đổi từ sản xuất thủ công sang sản xuất máy móc." }], faqItems: [{ question: "Nguyên nhân của Cách mạng công nghiệp?", answer: "Tiến bộ kỹ thuật, nguồn lực than đá, thủy lực và nhu cầu thị trường." }], quiz: { title: "Quiz Bài 7", passingScore: 70, questions: [{ type: "mc", text: "Yếu tố quan trọng của Cách mạng công nghiệp?", options: [{ id: new mongoose.Types.ObjectId(), text: "Máy móc" }, { id: new mongoose.Types.ObjectId(), text: "Nông cụ thô sơ" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Máy móc và công nghệ mới là yếu tố then chốt." }] } },
  { order: 8, title: "Bài 8: Các cuộc cách mạng công nghiệp thời kì hiện đại", description: "Tiếp nối và khác biệt của làn sóng công nghiệp hiện đại (kỹ thuật số, tự động hóa).", isFree: true, video: { title: "Cách mạng công nghiệp hiện đại", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 780 }, flashcards: [{ front: "Công nghiệp hiện đại", back: "Tự động hóa, thông tin, ứng dụng công nghệ số." }], faqItems: [{ question: "Đặc trưng của công nghiệp hiện đại?", answer: "Sử dụng công nghệ thông tin, tự động hóa, toàn cầu hóa." }], quiz: { title: "Quiz Bài 8", passingScore: 70, questions: [{ type: "mc", text: "Công nghiệp hiện đại nổi bật bởi?", options: [{ id: new mongoose.Types.ObjectId(), text: "Công nghệ số" }, { id: new mongoose.Types.ObjectId(), text: "Sử dụng sức kéo ngựa" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Công nghệ số là đặc trưng nổi bật." }] } },
  { order: 9, title: "Bài 9: Cơ sở hình thành văn minh Đông Nam Á thời kì cổ - trung đại", description: "Những yếu tố địa lý, văn hoá và giao thương hình thành văn minh Đông Nam Á.", isFree: true, video: { title: "Văn minh Đông Nam Á", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 600 }, flashcards: [{ front: "Đông Nam Á", back: "Vị trí địa lý thuận lợi cho giao thương biển và trao đổi văn hóa." }], faqItems: [{ question: "Yếu tố nào giúp hình thành văn minh Đông Nam Á?", answer: "Giao thương biển, đa dạng sinh thái, tiếp nhận  ảnh hưởng văn hóa Ấn Độ và Trung Hoa." }], quiz: { title: "Quiz Bài 9", passingScore: 70, questions: [{ type: "mc", text: "Yếu tố quan trọng cho Đông Nam Á?", options: [{ id: new mongoose.Types.ObjectId(), text: "Giao thương biển" }, { id: new mongoose.Types.ObjectId(), text: "Sa mạc" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Giao thương biển hỗ trợ phát triển văn minh." }] } },
  { order: 10, title: "Bài 10: Hành trình phát triển và thành tựu của văn minh Đông Nam Á thời kì cổ - trung đại", description: "Các thành tựu văn hóa, kiến trúc và tổ chức xã hội của Đông Nam Á cổ - trung đại.", isFree: true, video: { title: "Thành tựu Đông Nam Á", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 640 }, flashcards: [{ front: "Thành tựu", back: "Kiến trúc đền đài, chữ viết, hệ thống giao thương." }], faqItems: [{ question: "Thành tựu tiêu biểu?", answer: "Đền chùa, chữ viết, thủ công mỹ nghệ và thương mại quốc tế." }], quiz: { title: "Quiz Bài 10", passingScore: 70, questions: [{ type: "mc", text: "Thành tựu Đông Nam Á bao gồm?", options: [{ id: new mongoose.Types.ObjectId(), text: "Kiến trúc đền đài" }, { id: new mongoose.Types.ObjectId(), text: "Không có thành tựu" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Kiến trúc và thương mại là thành tựu tiêu biểu." }] } },
  { order: 11, title: "Bài 11: Một số nền văn minh cổ trên đất nước Việt Nam", description: "Tìm hiểu các nền văn minh cổ ở Việt Nam như Sa Huỳnh, Đồng Nai, Đông Sơn.", isFree: true, video: { title: "Văn minh cổ Việt Nam", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 700 }, flashcards: [{ front: "Đông Sơn", back: "Nền văn hóa nổi bật với trống đồng và đồ đồng." }], faqItems: [{ question: "Tên một nền văn minh cổ VN?", answer: "Đông Sơn, Sa Huỳnh." }], quiz: { title: "Quiz Bài 11", passingScore: 70, questions: [{ type: "mc", text: "Di vật tiêu biểu Đông Sơn?", options: [{ id: new mongoose.Types.ObjectId(), text: "Trống đồng" }, { id: new mongoose.Types.ObjectId(), text: "Xe hơi" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Trống đồng là di vật tiêu biểu." }] } },
  { order: 12, title: "Bài 12: Văn minh Đại Việt", description: "Sự hình thành và phát triển của văn minh Đại Việt trong các thời kỳ phong kiến.", isFree: true, video: { title: "Văn minh Đại Việt", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 720 }, flashcards: [{ front: "Đại Việt", back: "Tên gọi lịch sử của nhà nước phong kiến Việt Nam thời trung đại." }], faqItems: [{ question: "Đại Việt là gì?", answer: "Tên gọi của nhà nước phong kiến tiền hiện đại ở Việt Nam." }], quiz: { title: "Quiz Bài 12", passingScore: 70, questions: [{ type: "mc", text: "Đại Việt là tên gọi của?", options: [{ id: new mongoose.Types.ObjectId(), text: "Nhà nước phong kiến" }, { id: new mongoose.Types.ObjectId(), text: "Một loài thực vật" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Đại Việt là tên gọi lịch sử của nhà nước phong kiến." }] } },
  { order: 13, title: "Bài 13: Đời sống vật chất và tinh thần của cộng đồng các dân tộc Việt Nam", description: "Khảo sát đời sống, tập quán, văn hóa tinh thần của các dân tộc Việt Nam.", isFree: true, video: { title: "Đời sống các dân tộc", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 600 }, flashcards: [{ front: "Đời sống vật chất", back: "Sinh hoạt, nghề nghiệp, trang phục, nơi ở." }], faqItems: [{ question: "Đời sống tinh thần bao gồm?", answer: "Tín ngưỡng, lễ hội, nghệ thuật dân gian." }], quiz: { title: "Quiz Bài 13", passingScore: 70, questions: [{ type: "mc", text: "Đời sống tinh thần gồm?", options: [{ id: new mongoose.Types.ObjectId(), text: "Tín ngưỡng" }, { id: new mongoose.Types.ObjectId(), text: "Bảo hiểm xã hội" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Tín ngưỡng và lễ hội là phần của đời sống tinh thần." }] } },
  { order: 14, title: "Bài 14: Khởi đầu đoàn kết dân tộc trong lịch sử Việt Nam", description: "Những biểu hiện đầu tiên của tinh thần đoàn kết dân tộc trong lịch sử nước ta.", isFree: true, video: { title: "Đoàn kết dân tộc", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", durationSec: 540 }, flashcards: [{ front: "Đoàn kết dân tộc", back: "Sức mạnh tập thể giúp quốc gia vượt qua khủng hoảng." }], faqItems: [{ question: "Tại sao đoàn kết quan trọng?", answer: "Giúp bảo vệ và phát triển cộng đồng, chống xâm lăng." }], quiz: { title: "Quiz Bài 14", passingScore: 70, questions: [{ type: "mc", text: "Đoàn kết dân tộc mang lại?", options: [{ id: new mongoose.Types.ObjectId(), text: "Sức mạnh tập thể" }, { id: new mongoose.Types.ObjectId(), text: "Sự chia rẽ" }], correctOptionId: new mongoose.Types.ObjectId(), explanation: "Đoàn kết tạo sức mạnh cho dân tộc." }] } },
];

async function seedClass10Lessons() {
  const timelineSlugs = [
    "van-lang-au-lac",
    "bac-thuoc-khang-chien",
    "doc-lap-phong-kien",
    "phap-thuoc-giai-phong",
    "khang-chien-thong-nhat",
  ];

  const timelines = await Timeline.find({ slug: { $in: timelineSlugs } }).select("_id slug title");
  if (!timelines || timelines.length === 0) {
    console.error("❌ Không tìm thấy timeline phù hợp cho các bài lớp 10. Bỏ qua seed Class 10.");
    return;
  }

  const timelineIds = timelines.map((t) => t._id);

  const chapter = await Chapter.findOne({ class: 10, timelineId: { $in: timelineIds } });
  if (!chapter) {
    console.error("❌ Không tìm thấy chapter nào thuộc lớp 10 trong các timeline đã cho. Vui lòng tạo chapter trước.");
    return;
  }

  console.log(`\n🌱 Seeding 14 lessons cho chapter: ${chapter.title} (class 10)`);

  const demoUser = await ensureDemoUser();

  for (const item of class10Lessons) {
    const lessonQuery = { chapterId: chapter._id, order: item.order };

    let lesson = await Lesson.findOne(lessonQuery);
    if (!lesson) {
      lesson = await Lesson.create({
        chapterId: chapter._id,
        title: item.title,
        description: item.description,
        order: item.order,
        isFree: item.isFree,
        isPublished: true,
        videos: [{ title: item.video.title, url: item.video.url, provider: "youtube", order: 1, durationSec: item.video.durationSec }],
      });
      console.log(`  ✅ Lesson: ${item.title}`);
    } else {
      lesson.title = item.title;
      lesson.description = item.description;
      lesson.isFree = item.isFree;
      lesson.isPublished = true;
      lesson.set("videos", [{ title: item.video.title, url: item.video.url, provider: "youtube", order: 1, durationSec: item.video.durationSec }]);
      await lesson.save();
      console.log(`  ♻️  Cập nhật lesson: ${item.title}`);
    }

    const lessonId = lesson._id;

    // Quiz
    const quizQuestions = item.quiz.questions.map((q) => ({
      ...q,
      options: q.options.map((opt) => ({ id: new mongoose.Types.ObjectId(), text: opt.text })),
      correctOptionId: q.options[0]?.id ?? new mongoose.Types.ObjectId(),
    }));

    let quiz = await Quiz.findOne({ lessonId });
    if (!quiz) {
      quiz = await Quiz.create({ lessonId, title: item.quiz.title, passingScore: item.quiz.passingScore, timeLimitSec: 600, questions: buildQuizQuestions(quizQuestions) });
    } else {
      quiz.title = item.quiz.title;
      quiz.passingScore = item.quiz.passingScore;
      quiz.questions = buildQuizQuestions(quizQuestions) as typeof quiz.questions;
      await quiz.save();
    }

    // Flashcards
    let flashcardSet = await FlashcardSet.findOne({ lessonId });
    if (!flashcardSet) {
      flashcardSet = await FlashcardSet.create({ lessonId, title: `Flashcard: ${item.title}`, cards: item.flashcards.map((c, i) => ({ front: c.front, back: c.back, order: i + 1 })) });
    } else {
      flashcardSet.title = `Flashcard: ${item.title}`;
      flashcardSet.cards = item.flashcards.map((c, i) => ({ front: c.front, back: c.back, order: i + 1 })) as typeof flashcardSet.cards;
      await flashcardSet.save();
    }

    // Seed Mindmap
    await Mindmap.deleteMany({ lessonId });
    await Mindmap.create({
      lessonId,
      title: item.title,
      sections: buildSampleMindmap(item.title),
    });

    lesson.quiz = quiz._id;
    lesson.flashcardSetId = flashcardSet._id;
    await lesson.save();

    // User progress demo
    await UserLessonProgress.findOneAndUpdate(
      { userId: demoUser._id, lessonId },
      { userId: demoUser._id, lessonId, status: "locked", videoWatchedPct: 0, flashcardsViewed: false, quizBestScore: 0, quizPassed: false, quizAttempts: 0 },
      { upsert: true, new: true },
    );

    console.log(`     → seeded: quiz, flashcards(${item.flashcards.length}), faq(${item.faqItems.length})`);
  }
}

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

    // Seed Mindmap
    await Mindmap.deleteMany({ lessonId });
    await Mindmap.create({
      lessonId,
      title: item.title,
      sections: buildSampleMindmap(item.title),
    });

    // ── Liên kết lesson ───────────────────────────────────────────────────────
    lesson.quiz = quiz._id;
    lesson.flashcardSetId = flashcardSet._id;
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
  await seedClass10Lessons();

  console.log("\n🎉 Seed completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
