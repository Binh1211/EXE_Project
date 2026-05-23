import { Router } from "express";
import {
  createTimelineHandler,
  deleteTimelineHandler,
  getTimeline,
  listTimelines,
  updateTimelineHandler,
} from "../controllers/timeline.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(listTimelines));
router.get("/:slug", asyncHandler(getTimeline));
router.post("/", asyncHandler(createTimelineHandler));
router.put("/:id", asyncHandler(updateTimelineHandler));
router.delete("/:id", asyncHandler(deleteTimelineHandler));

export default router;