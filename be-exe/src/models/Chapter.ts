import mongoose, { Schema } from "mongoose";

const chapterSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  coverImageUrl: String,
  order: { type: Number, required: true, index: true },
  requiredLevel: { type: Number, enum: [1, 2, 3], default: 1 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export const Chapter = mongoose.model("Chapter", chapterSchema);
