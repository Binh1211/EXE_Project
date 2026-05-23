import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema(
  {
    questionId: Schema.Types.ObjectId,
    selectedOption: Schema.Types.ObjectId,
    isCorrect: Boolean,
  },
  { _id: false },
);

const quizAttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  score: Number,
  passed: Boolean,
  timeTakenSec: Number,
  answers: [answerSchema],
  xpAwarded: Number,
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

quizAttemptSchema.index({ userId: 1, quizId: 1 });

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
