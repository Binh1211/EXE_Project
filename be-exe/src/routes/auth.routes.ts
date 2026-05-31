import { Router } from "express";
import {
  changePasswordHandler,
  forgotPasswordHandler,
  getMe,
  googleCallback,
  googleOAuthStatusHandler,
  googleRedirect,
  login,
  logoutHandler,
  register,
  resetPasswordHandler,
  updateProfileHandler,
  uploadAvatarHandler,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/forgot-password", asyncHandler(forgotPasswordHandler));
router.post("/reset-password", asyncHandler(resetPasswordHandler));

router.get("/google/status", asyncHandler(googleOAuthStatusHandler));
router.get("/google", asyncHandler(googleRedirect));
router.get("/google/callback", asyncHandler(googleCallback));

router.get("/me", requireAuth, asyncHandler(getMe));
router.put("/profile", requireAuth, asyncHandler(updateProfileHandler));
router.post("/avatar", requireAuth, asyncHandler(uploadAvatarHandler));
router.put("/change-password", requireAuth, asyncHandler(changePasswordHandler));
router.post("/logout", requireAuth, asyncHandler(logoutHandler));

export default router;
