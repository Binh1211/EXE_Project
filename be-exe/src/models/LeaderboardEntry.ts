import mongoose, { Schema } from "mongoose";

const leaderboardEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  scope: { type: String, enum: ["global", "group", "weekly"], required: true },
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  period: { type: String, default: "alltime" },
  totalXp: { type: Number, default: 0 },
  rank: Number,
  quizzesPassed: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  groupSessionsWon: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

leaderboardEntrySchema.index({ scope: 1, period: 1, totalXp: -1 });

export const LeaderboardEntry = mongoose.model(
  "LeaderboardEntry",
  leaderboardEntrySchema,
);
