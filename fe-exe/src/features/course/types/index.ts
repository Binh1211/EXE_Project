export interface Chapter {
  _id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  slug: string;
  timelineId: string;
  order: number;
  requiredLevel: 1 | 2 | 3;
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
  quiz?: LessonQuiz;
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
