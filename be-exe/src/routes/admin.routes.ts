import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import {
  getUsersHandler,
  updateUserHandler,
  getTimelinesHandler,
  createTimelineHandler,
  updateTimelineHandler,
  deleteTimelineHandler,
  getChaptersHandler,
  createChapterHandler,
  updateChapterHandler,
  deleteChapterHandler,
  getLessonsHandler,
  createLessonHandler,
  updateLessonHandler,
  deleteLessonHandler,
  getRevenueHandler
} from "../controllers/admin.controller.js";

const router = Router();

// Apply auth and admin middleware to all routes in this router
router.use(requireAuth);
router.use(requireAdmin);

router.get("/users", getUsersHandler);
router.put("/users/:id", updateUserHandler);

router.get("/timelines", getTimelinesHandler);
router.post("/timelines", createTimelineHandler);
router.put("/timelines/:id", updateTimelineHandler);
router.delete("/timelines/:id", deleteTimelineHandler);

router.get("/chapters", getChaptersHandler);
router.post("/chapters", createChapterHandler);
router.put("/chapters/:id", updateChapterHandler);
router.delete("/chapters/:id", deleteChapterHandler);

router.get("/lessons", getLessonsHandler);
router.post("/lessons", createLessonHandler);
router.put("/lessons/:id", updateLessonHandler);
router.delete("/lessons/:id", deleteLessonHandler);

router.get("/revenue", getRevenueHandler);

export default router;
