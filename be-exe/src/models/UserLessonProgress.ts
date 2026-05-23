import mongoose, { Schema } from "mongoose";

const userLessonProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  status: {
    type: String,
    enum: ["locked", "unlocked", "completed"],
    default: "locked",
  },
  videoWatchedPct: { type: Number, default: 0 },
  videoCompletedAt: Date,
  flashcardsViewed: { type: Boolean, default: false },
  quizBestScore: { type: Number, default: 0 },
  quizPassed: { type: Boolean, default: false },
  quizAttempts: { type: Number, default: 0 },
  completedAt: Date,
});

userLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
userLessonProgressSchema.index({ userId: 1, status: 1 });

export const UserLessonProgress = mongoose.model(
  "UserLessonProgress",
  userLessonProgressSchema,
);
