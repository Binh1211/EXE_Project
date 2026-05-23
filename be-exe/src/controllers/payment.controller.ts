import type { Request, Response } from "express";
import { z } from "zod";
import { createPayment, deletePayment, getPaymentById, listPayments, updatePayment } from "../services/payment.service.js";

const createSchema = z.object({
  userId: z.string().min(1),
  gateway: z.enum(["vnpay", "momo", "stripe"]),
  gatewayRef: z.string().optional(),
  amountVnd: z.number().min(0),
  planPurchased: z.enum(["level2", "level3"]),
  durationDays: z.number().int().min(0).optional(),
  metadata: z.any().optional(),
});

const updateSchema = z.object({
  status: z.enum(["pending", "success", "failed", "refunded"]).optional(),
  gatewayRef: z.string().optional(),
  amountVnd: z.number().min(0).optional(),
  durationDays: z.number().int().min(0).optional(),
  metadata: z.any().optional(),
  paidAt: z.string().datetime().optional(),
});

export async function listHandler(req: Request, res: Response) {
  const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const gateway = typeof req.query.gateway === "string" ? req.query.gateway : undefined;
  const planPurchased = typeof req.query.planPurchased === "string" ? req.query.planPurchased : undefined;
  const payments = await listPayments({ userId, status, gateway, planPurchased });
  res.json(payments);
}

export async function getHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payment = await getPaymentById(id);
  res.json(payment);
}

export async function createHandler(req: Request, res: Response) {
  const data = createSchema.parse(req.body);
  const payment = await createPayment(data);
  res.status(201).json(payment);
}

export async function updateHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = updateSchema.parse(req.body);
  const payment = await updatePayment(id, {
    ...data,
    paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
  });
  res.json(payment);
}

export async function deleteHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deletePayment(id);
  res.json(result);
}
