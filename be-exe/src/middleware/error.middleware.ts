import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AuthError } from "../services/auth.service.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AuthError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.errors.map((e) => e.message).join(", "),
    });
  }

  console.error(err);
  res.status(500).json({ message: "Lỗi server nội bộ." });
}
