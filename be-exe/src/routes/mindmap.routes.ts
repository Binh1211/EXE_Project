import { Router } from "express";
import { getMindmapByLesson } from "../controllers/mindmap.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/lesson/:lessonId", asyncHandler(getMindmapByLesson));

export default router;
