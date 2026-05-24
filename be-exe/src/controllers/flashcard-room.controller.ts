import { type Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createRoom,
  getRoomByCode,
  submitAnswers,
  getLeaderboard,
  closeRoom,
  FlashcardRoomError,
} from "../services/flashcard-room.service.js";
import { z } from "zod";

const createRoomSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  timeLimitSec: z.number().int().min(10, "Thời gian tối thiểu 10s").default(900),
  questions: z.array(
    z.object({
      text: z.string(),
      imageUrl: z.string().optional(),
      options: z.array(z.object({ text: z.string() })).min(2),
      correctOptionIndex: z.number().int().min(0),
      points: z.number().int().default(10),
    })
  ).min(1, "Phải có ít nhất 1 câu hỏi"),
});

export async function createRoomHandler(req: AuthRequest, res: Response) {
  try {
    const input = createRoomSchema.parse(req.body);
    const room = await createRoom({
      hostId: req.userId!,
      title: input.title,
      timeLimitSec: input.timeLimitSec,
      questions: input.questions,
    });
    res.status(201).json({ joinCode: room.joinCode, message: "Tạo phòng thành công!" });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error instanceof FlashcardRoomError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Lỗi server." });
  }
}

export async function getRoomHandler(req: AuthRequest, res: Response) {
  try {
    const { code } = req.params;
    const room = await getRoomByCode(code as string);
    res.json(room);
  } catch (error: any) {
    if (error instanceof FlashcardRoomError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Lỗi server." });
  }
}

export async function submitAnswersHandler(req: AuthRequest, res: Response) {
  try {
    const { code } = req.params;
    const { answers, timeTakenSec } = req.body;
    const result = await submitAnswers(code as string, req.userId!, answers || [], timeTakenSec || 0);
    res.json(result);
  } catch (error: any) {
    if (error instanceof FlashcardRoomError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Lỗi server." });
  }
}

export async function getLeaderboardHandler(req: AuthRequest, res: Response) {
  try {
    const { code } = req.params;
    const result = await getLeaderboard(code as string);
    res.json(result);
  } catch (error: any) {
    if (error instanceof FlashcardRoomError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Lỗi server." });
  }
}

export async function closeRoomHandler(req: AuthRequest, res: Response) {
  try {
    const { code } = req.params;
    const result = await closeRoom(code as string, req.userId!);
    res.json(result);
  } catch (error: any) {
    if (error instanceof FlashcardRoomError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Lỗi server." });
  }
}
