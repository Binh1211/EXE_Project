import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema(
  {
    cardId: { type: Schema.Types.ObjectId, auto: true },
    front: String,
    back: String,
    imageUrl: String,
    order: Number,
  },
  { _id: true },
);

const flashcardSetSchema = new Schema({
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  title: String,
  cards: [cardSchema],
  createdAt: { type: Date, default: Date.now },
});

export const FlashcardSet = mongoose.model("FlashcardSet", flashcardSetSchema);
