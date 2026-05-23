import { Router } from "express";
import {
  createLessonHandler,
  deleteLessonHandler,
  getLesson,
  listLessons,
  updateLessonHandler,
} from "../controllers/lesson.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(listLessons));
router.get("/:id", asyncHandler(getLesson));
router.post("/", asyncHandler(createLessonHandler));
router.put("/:id", asyncHandler(updateLessonHandler));
router.delete("/:id", asyncHandler(deleteLessonHandler));

export default router;
