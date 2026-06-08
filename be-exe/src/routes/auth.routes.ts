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
router.post("/refresh", asyncHandler(async (req, res) => {
  // lazy-load to avoid circular dependencies
  const { RefreshToken } = await import("../models/index.js");
  const { verifyRefreshToken } = await import("../utils/jwt.js");
  const { hashToken } = await import("../utils/hash.js");

  const raw = req.cookies?.refresh_token as string | undefined;
  if (!raw) return res.status(401).json({ message: "No refresh token." });

  let payload: any;
  try {
    payload = verifyRefreshToken(raw);
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token." });
  }

  const tokenHash = hashToken(raw);
  const record = await RefreshToken.findOne({ tokenHash, userId: payload.sub, expiresAt: { $gt: new Date() } });
  if (!record) return res.status(401).json({ message: "Refresh token expired or not found." });

  const { signAccessToken } = await import("../utils/jwt.js");
  const user = await (await import("../models/index.js")).User.findById(payload.sub);
  if (!user) return res.status(401).json({ message: "User not found." });

  const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email, role: user.role });
  res.json({ accessToken });
}));
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
