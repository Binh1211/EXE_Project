import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["owner", "mod", "member"], default: "member" },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const groupSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  inviteCode: { type: String, required: true, unique: true },
  maxMembers: { type: Number, default: 50 },
  isPrivate: { type: Boolean, default: true },
  members: [memberSchema],
}, { timestamps: true });

export const Group = mongoose.model("Group", groupSchema);
