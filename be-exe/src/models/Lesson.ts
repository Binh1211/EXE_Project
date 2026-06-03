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

const lessonSchema = new Schema(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: String,
    coverImageUrl: String,
    order: { type: Number, required: true, index: true },
    isFree: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false },
    videos: [videoSchema],
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
    flashcardSetId: { type: Schema.Types.ObjectId, ref: "FlashcardSet" },
  },
  { timestamps: true },
);

lessonSchema.index({ chapterId: 1, order: 1 });

export const Lesson = mongoose.model("Lesson", lessonSchema);
