import mongoose, { Schema } from "mongoose";

const leaderboardEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  period: { type: String, default: "alltime" },
  rank: Number,
  quizzesPassed: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  groupSessionsWon: { type: Number, default: 0 },
}, { timestamps: true });

leaderboardEntrySchema.index({ period: 1, rank: 1 });

export const LeaderboardEntry = mongoose.model(
  "LeaderboardEntry",
  leaderboardEntrySchema,
);
