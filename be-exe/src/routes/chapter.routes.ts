import { Router } from "express";
import {
  createChapterHandler,
  deleteChapterHandler,
  getChapter,
  listChapters,
  updateChapterHandler,
} from "../controllers/chapter.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(listChapters));
router.get("/:slug", asyncHandler(getChapter));
router.post("/", asyncHandler(createChapterHandler));
router.put("/:id", asyncHandler(updateChapterHandler));
router.delete("/:id", asyncHandler(deleteChapterHandler));

export default router;
