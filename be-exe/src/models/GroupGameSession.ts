import mongoose, { Schema } from "mongoose";

const participantSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: Number,
    rank: Number,
    timeTakenSec: Number,
  },
  { _id: false },
);

const groupGameSessionSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true, index: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["waiting", "active", "ended"],
    default: "waiting",
  },
  joinCode: { type: String, index: true },
  startedAt: Date,
  endedAt: Date,
  participants: [participantSchema],
  xpMultiplier: { type: Number, default: 1.5 },
  createdAt: { type: Date, default: Date.now },
});

groupGameSessionSchema.index({ groupId: 1, status: 1 });

export const GroupGameSession = mongoose.model(
  "GroupGameSession",
  groupGameSessionSchema,
);
