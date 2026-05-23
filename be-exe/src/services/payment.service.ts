import mongoose from "mongoose";
import { PaymentTransaction, User } from "../models/index.js";

export class PaymentError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new PaymentError(400, "ID không hợp lệ.");
  }
}

async function ensureUserExists(userId: string) {
  validateObjectId(userId);
  const user = await User.findById(userId);
  if (!user) throw new PaymentError(404, "Người dùng không tồn tại.");
}

export async function listPayments(filters: {
  userId?: string;
  status?: string;
  gateway?: string;
  planPurchased?: string;
} = {}) {
  const query: Record<string, unknown> = {};
  if (filters.userId) {
    validateObjectId(filters.userId);
    query.userId = new mongoose.Types.ObjectId(filters.userId);
  }
  if (filters.status) query.status = filters.status;
  if (filters.gateway) query.gateway = filters.gateway;
  if (filters.planPurchased) query.planPurchased = filters.planPurchased;
  return await PaymentTransaction.find(query).sort({ createdAt: -1 });
}

export async function getPaymentById(id: string) {
  validateObjectId(id);
  const payment = await PaymentTransaction.findById(id);
  if (!payment) throw new PaymentError(404, "Không tìm thấy payment transaction.");
  return payment;
}

export async function createPayment(input: {
  userId: string;
  gateway: "vnpay" | "momo" | "stripe";
  gatewayRef?: string;
  amountVnd: number;
  planPurchased: "level2" | "level3";
  durationDays?: number;
  metadata?: unknown;
}) {
  await ensureUserExists(input.userId);

  const payload: any = {
    userId: new mongoose.Types.ObjectId(input.userId),
    gateway: input.gateway,
    gatewayRef: input.gatewayRef,
    amountVnd: input.amountVnd,
    planPurchased: input.planPurchased,
    durationDays: input.durationDays,
    metadata: input.metadata,
  };

  return await PaymentTransaction.create(payload);
}

export async function updatePayment(
  id: string,
  updates: {
    status?: "pending" | "success" | "failed" | "refunded";
    gatewayRef?: string;
    amountVnd?: number;
    durationDays?: number;
    metadata?: unknown;
    paidAt?: Date | null;
  },
) {
  validateObjectId(id);
  const payment = await PaymentTransaction.findById(id);
  if (!payment) throw new PaymentError(404, "Không tìm thấy payment transaction.");

  if (updates.status !== undefined) payment.status = updates.status;
  if (updates.gatewayRef !== undefined) payment.gatewayRef = updates.gatewayRef;
  if (updates.amountVnd !== undefined) payment.amountVnd = updates.amountVnd;
  if (updates.durationDays !== undefined) payment.durationDays = updates.durationDays;
  if (updates.metadata !== undefined) payment.metadata = updates.metadata;
  if (updates.paidAt !== undefined) payment.paidAt = updates.paidAt;

  await payment.save();
  return payment;
}

export async function deletePayment(id: string) {
  validateObjectId(id);
  const deleted = await PaymentTransaction.findByIdAndDelete(id);
  if (!deleted) throw new PaymentError(404, "Không tìm thấy payment transaction.");
  return { message: "Payment transaction đã được xóa." };
}
