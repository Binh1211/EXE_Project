import { Router } from "express";
import {
  addParticipantHandler,
  createSessionHandler,
  deleteSessionHandler,
  endSessionHandler,
  getSession,
  listAllSessions,
  removeParticipantHandler,
  startSessionHandler,
  updateSessionHandler,
} from "../controllers/group-game-session.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listAllSessions));
router.get("/:id", asyncHandler(getSession));
router.post("/", asyncHandler(createSessionHandler));
router.put("/:id", asyncHandler(updateSessionHandler));
router.delete("/:id", asyncHandler(deleteSessionHandler));

router.post("/:id/start", asyncHandler(startSessionHandler));
router.post("/:id/end", asyncHandler(endSessionHandler));
router.post("/:id/join", asyncHandler(addParticipantHandler));
router.post("/:id/leave/:userId", asyncHandler(removeParticipantHandler));

export default router;
