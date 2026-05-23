import { Router } from "express";
import {
  createLessonProgress,
  deleteLessonProgressHandler,
  getLessonProgress,
  getLessonProgressByLessonId,
  listLessonProgress,
  updateLessonProgressHandler,
} from "../controllers/lesson-progress.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listLessonProgress));
router.get("/lesson/:lessonId", asyncHandler(getLessonProgressByLessonId));
router.get("/:id", asyncHandler(getLessonProgress));
router.post("/", asyncHandler(createLessonProgress));
router.put("/:id", asyncHandler(updateLessonProgressHandler));
router.delete("/:id", asyncHandler(deleteLessonProgressHandler));

export default router;
