import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    url: String,
    provider: { type: String, enum: ["youtube", "vimeo", "s3"] },
    durationSec: Number,
    thumbnailUrl: String,
  },
  { _id: false },
);

const lessonSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true, index: true },
  title: { type: String, required: true },
  order: { type: Number, required: true, index: true },
  isFree: { type: Boolean, default: false, index: true },
  isPublished: { type: Boolean, default: false },
  video: videoSchema,
}, { timestamps: true });

lessonSchema.index({ chapterId: 1, order: 1 });

export const Lesson = mongoose.model("Lesson", lessonSchema);
