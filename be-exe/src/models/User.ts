import mongoose, { Schema, type InferSchemaType } from "mongoose";

const oauthProviderSchema = new Schema(
  {
    provider: { type: String, required: true },
    uid: { type: String, required: true },
  },
  { _id: false },
);

const subscriptionSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["free", "paid", "trial"],
      default: "free",
    },
    plan: { type: String, enum: ["level2", "level3"], default: undefined },
    startDate: Date,
    expiresAt: Date,
    paymentRef: String,
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    level: { type: Number, enum: [1, 2, 3], default: 1 },
    levelUpgradedAt: Date,
    totalXp: { type: Number, default: 0 },
    subscription: { type: subscriptionSchema, default: () => ({ status: "free" }) },
    oauthProviders: [oauthProviderSchema],
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: false },
);

userSchema.index({ level: 1 });
userSchema.index({ role: 1 });

export type IUser = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export const User = mongoose.model("User", userSchema);
