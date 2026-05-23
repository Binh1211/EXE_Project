import mongoose, { Schema } from "mongoose";

const paymentTransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending",
  },
  gateway: { type: String, enum: ["vnpay", "momo", "stripe"] },
  gatewayRef: String,
  amountVnd: Number,
  planPurchased: { type: String, enum: ["level2", "level3"] },
  durationDays: Number,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
});

paymentTransactionSchema.index({ userId: 1, status: 1 });

export const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema,
);
