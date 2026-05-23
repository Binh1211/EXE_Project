import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["lesson_unlocked", "group_invite", "rank_changed", "payment"],
  },
  title: String,
  body: String,
  data: Schema.Types.Mixed,
  isRead: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 },
);

export const Notification = mongoose.model("Notification", notificationSchema);
