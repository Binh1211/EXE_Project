import mongoose, { Schema } from "mongoose";

const optionSchema = new Schema(
  { id: { type: Schema.Types.ObjectId, auto: true }, text: String },
  { _id: true },
);

const questionSchema = new Schema(
  {
    questionId: { type: Schema.Types.ObjectId, auto: true },
    type: { type: String, enum: ["mc", "truefalse", "fill"] },
    text: String,
    imageUrl: String,
    options: [optionSchema],
    correctOptionId: Schema.Types.ObjectId,
    explanation: String,
    points: { type: Number, default: 1 },
  },
  { _id: true },
);

const quizSchema = new Schema({
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
  title: String,
  passingScore: { type: Number, default: 90 },
  timeLimitSec: Number,
  xpReward: { type: Number, default: 20 },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model("Quiz", quizSchema);
