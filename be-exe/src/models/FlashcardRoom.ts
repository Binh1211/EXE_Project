import mongoose, { Schema } from "mongoose";

const optionSchema = new Schema(
  { text: String },
  { _id: false }
);

const questionSchema = new Schema(
  {
    text: { type: String, required: true },
    imageUrl: String,
    options: [optionSchema],
    correctOptionIndex: { type: Number, required: true }, // 0 to 3
    points: { type: Number, default: 10 },
  },
  { _id: true }
);

const participantSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    displayName: String,
    score: { type: Number, default: 0 },
    timeTakenSec: { type: Number, default: 0 },
    submittedAt: Date,
  },
  { _id: false }
);

const flashcardRoomSchema = new Schema(
  {
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    joinCode: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    timeLimitSec: { type: Number, default: 900 }, // default 15 minutes
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    questions: [questionSchema],
    participants: [participantSchema],
  },
  { timestamps: true }
);

export const FlashcardRoom = mongoose.model("FlashcardRoom", flashcardRoomSchema);
