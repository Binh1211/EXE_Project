import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createRoomHandler,
  getRoomHandler,
  submitAnswersHandler,
  getLeaderboardHandler,
  closeRoomHandler,
} from "../controllers/flashcard-room.controller.js";

const router = Router();

// Lấy thông tin phòng để chơi (cần auth để xác định userId tham gia)
router.get("/:code", requireAuth, getRoomHandler);

// Lấy bảng xếp hạng (có thể công khai hoặc auth, ở đây dùng auth để bảo mật)
router.get("/:code/leaderboard", requireAuth, getLeaderboardHandler);

// Tạo phòng (chỉ level 3 - sẽ được kiểm tra trong controller hoặc middleware)
router.post("/", requireAuth, createRoomHandler);

// Nộp bài
router.post("/:code/submit", requireAuth, submitAnswersHandler);

// Đóng phòng (Host)
router.put("/:code/close", requireAuth, closeRoomHandler);

export default router;
