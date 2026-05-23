import { Router } from "express";
import {
  createNotificationHandler,
  deleteNotificationHandler,
  getNotification,
  listNotifications,
  updateNotificationHandler,
} from "../controllers/notification.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listNotifications));
router.get("/:id", asyncHandler(getNotification));
router.post("/", asyncHandler(createNotificationHandler));
router.put("/:id", asyncHandler(updateNotificationHandler));
router.delete("/:id", asyncHandler(deleteNotificationHandler));

export default router;
