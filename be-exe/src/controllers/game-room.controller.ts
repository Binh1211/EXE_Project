import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createGameRoom,
  getGameRoomByCode,
  toGameRoomDto,
} from "../services/game-room.service.js";

const createRoomSchema = z.object({
  quizId: z.string().min(1),
});

export async function createGameRoomHandler(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Yêu cầu đăng nhập." });
    return;
  }

  const data = createRoomSchema.parse(req.body);
  const room = await createGameRoom({ quizId: data.quizId, userId });
  res.status(201).json({ roomCode: room.roomCode });
}

export async function getGameRoomHandler(req: AuthRequest, res: Response) {
  const roomCode = Array.isArray(req.params.roomCode)
    ? req.params.roomCode[0]
    : req.params.roomCode;
  const room = await getGameRoomByCode(roomCode);
  res.json(toGameRoomDto(room));
}
