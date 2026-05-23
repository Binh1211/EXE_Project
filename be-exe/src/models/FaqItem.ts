import mongoose, { Schema } from "mongoose";

const faqItemSchema = new Schema({
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
  question: String,
  answer: String,
  order: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const FaqItem = mongoose.model("FaqItem", faqItemSchema);
