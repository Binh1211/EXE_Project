import { Router } from "express";
import {
  createGameRoomHandler,
  getGameRoomHandler,
} from "../controllers/game-room.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post("/", requireAuth, asyncHandler(createGameRoomHandler));
router.get("/:roomCode", requireAuth, asyncHandler(getGameRoomHandler));

export default router;
