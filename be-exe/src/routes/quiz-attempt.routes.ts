import { Router } from "express";
import {
  createAttemptHandler,
  deleteAttemptHandler,
  getAttempt,
  listAttempts,
  updateAttemptHandler,
} from "../controllers/quiz-attempt.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listAttempts));
router.get("/:id", asyncHandler(getAttempt));
router.post("/", asyncHandler(createAttemptHandler));
router.put("/:id", asyncHandler(updateAttemptHandler));
router.delete("/:id", asyncHandler(deleteAttemptHandler));

export default router;
