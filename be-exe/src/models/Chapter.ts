import mongoose, { Schema } from "mongoose";

const chapterSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  coverImageUrl: String,
  timelineId: { type: Schema.Types.ObjectId, ref: "Timeline", required: true },
  order: { type: Number, required: true, index: true },
  requiredLevel: { type: Number, enum: [1, 2, 3], default: 1 },
  class: { type: Number, enum: [10, 11, 12, 0], default: 0 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export const Chapter = mongoose.model("Chapter", chapterSchema);
