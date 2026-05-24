import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    provider: { type: String, enum: ["youtube", "vimeo", "s3"] },
    order: { type: Number, default: 0 },
    durationSec: Number,
    thumbnailUrl: String,
  },
  { _id: true },
);

const optionSchema = new Schema(
  { text: { type: String, required: true } },
  { _id: true },
);

const quizQuestionSchema = new Schema(
  {
    type: { type: String, enum: ["mc", "truefalse"], required: true },
    text: { type: String, required: true },
    imageUrl: String,
    options: [optionSchema],
    correctOptionId: Schema.Types.ObjectId,
    explanation: String,
    points: { type: Number, default: 1 },
  },
  { _id: true },
);

const lessonSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true, index: true },
  title: { type: String, required: true },
  description: String,
  coverImageUrl: String,
  order: { type: Number, required: true, index: true },
  isFree: { type: Boolean, default: false, index: true },
  isPublished: { type: Boolean, default: false },
  videos: [videoSchema],
  quiz: {type: Schema.Types.ObjectId, ref: "Quiz"},
}, { timestamps: true });

lessonSchema.index({ chapterId: 1, order: 1 });

export const Lesson = mongoose.model("Lesson", lessonSchema);
