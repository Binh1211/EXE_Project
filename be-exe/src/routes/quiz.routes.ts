import { Router } from "express";
import {
  createQuizHandler,
  deleteQuizHandler,
  getQuiz,
  listQuizzes,
  listQuizzesByLesson,
  updateQuizHandler,
} from "../controllers/quiz.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(listQuizzes));
router.get("/lesson/:lessonId", asyncHandler(listQuizzesByLesson));
router.get("/:id", asyncHandler(getQuiz));
router.post("/", asyncHandler(createQuizHandler));
router.put("/:id", asyncHandler(updateQuizHandler));
router.delete("/:id", asyncHandler(deleteQuizHandler));

export default router;
