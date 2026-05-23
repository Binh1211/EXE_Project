import { Router } from "express";
import {
  addMemberHandler,
  createGroupHandler,
  deleteGroupHandler,
  getByInvite,
  getGroup,
  listAll,
  removeMemberHandler,
  updateGroupHandler,
  updateMemberRoleHandler,
} from "../controllers/group.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/invite/:code", asyncHandler(getByInvite));

router.use(requireAuth);

router.get("/", asyncHandler(listAll));
router.get("/:id", asyncHandler(getGroup));
router.post("/", asyncHandler(createGroupHandler));
router.put("/:id", asyncHandler(updateGroupHandler));
router.delete("/:id", asyncHandler(deleteGroupHandler));

router.post("/:id/members", asyncHandler(addMemberHandler));
router.put("/:id/members/:userId", asyncHandler(updateMemberRoleHandler));
router.delete("/:id/members/:userId", asyncHandler(removeMemberHandler));

export default router;
