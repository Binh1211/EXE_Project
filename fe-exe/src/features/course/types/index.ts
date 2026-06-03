export interface Chapter {
  _id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  slug: string;
  timelineId: string;
  order: number;
  requiredLevel: 1 | 2 | 3;
  class?: 10 | 11 | 12 | 0;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  _id: string;
  chapterId: string;
  title: string;
  description?: string;
  order: number;
  isFree?: boolean;
  isPublished?: boolean;
  coverImageUrl?: string;
  videos?: LessonVideo[];
  quiz?: string | LessonQuiz;
  flashcardSetId?: string;
  faqId?: string;
  progress?: LessonProgress;
  isLocked?: boolean;
  unlockRequirement?: {
    lessonId: string;
    title: string;
    message: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardSet {
  _id: string;
  lessonId: string;
  title: string;
  cards: FlashcardItem[];
}

export interface FlashcardItem {
  _id?: string;
  cardId?: string;
  front: string;
  back: string;
  imageUrl?: string;
  order?: number;
}

export interface MindmapItem {
  label?: string;
  content: string;
  icon?: string;
}

export interface MindmapTopic {
  title: string;
  illustrationUrl?: string;
  items: MindmapItem[];
}

export interface MindmapSection {
  title: string;
  layoutType: "rect" | "scroll";
  topics: MindmapTopic[];
}

export interface Mindmap {
  _id: string;
  lessonId: string;
  title: string;
  sections: MindmapSection[];
}

export interface LessonDetail extends Lesson {
  quizData?: LessonQuizDocument | null;
  flashcardSet?: FlashcardSet | null;
  mindmap?: Mindmap | null;
}

export interface LessonQuizDocument extends LessonQuiz {
  _id: string;
  lessonId: string;
}

export interface LessonVideo {
  _id?: string;
  title: string;
  url: string;
  provider?: "youtube" | "vimeo" | "s3";
  order?: number;
  durationSec?: number;
  thumbnailUrl?: string;
}

export interface LessonQuiz {
  title: string;
  passingScore?: number;
  timeLimitSec?: number;
  questions?: LessonQuizQuestion[];
}

export interface LessonQuizQuestion {
  _id?: string;
  questionId?: string;
  type: "mc" | "truefalse";
  text: string;
  imageUrl?: string;
  options?: {
    _id?: string;
    text: string;
  }[];
  correctOptionId?: string;
  explanation?: string;
  points?: number;
}

export interface LessonProgress {
  _id?: string;
  lessonId: string;
  status: "locked" | "unlocked" | "completed";
  videoWatchedPct?: number;
  videoCompletedAt?: string;
  flashcardsViewed?: boolean;
  quizBestScore?: number;
  quizPassed?: boolean;
  quizAttempts?: number;
  completedAt?: string;
}
