import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  AuthError,
  changePassword,
  findOrCreateGoogleUser,
  forgotPassword,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateProfile,
  uploadAvatar,
} from "../services/auth.service.js";
import {
  decodeGoogleState,
  getGoogleAuthorizationUrl,
  handleGoogleCallback,
} from "../services/google-oauth.service.js";
import { isGoogleOAuthEnabled } from "../config/env.js";

const registerSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được để trống."),
  email: z.string().email("Email không hợp lệ."),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

const profileSchema = z.object({
  fullName: z.string().min(1),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function register(req: AuthRequest, res: Response) {
  const body = registerSchema.parse(req.body);
  const result = await registerUser(body);
  res.status(201).json(result);
}

export async function login(req: AuthRequest, res: Response) {
  const body = loginSchema.parse(req.body);
  const result = await loginUser(body.email, body.password);
  res.json(result);
}

export async function forgotPasswordHandler(req: AuthRequest, res: Response) {
  const { email } = forgotSchema.parse(req.body);
  const result = await forgotPassword(email);
  res.json(result);
}

export async function resetPasswordHandler(req: AuthRequest, res: Response) {
  const body = resetSchema.parse(req.body);
  const result = await resetPassword(body.token, body.password);
  res.json(result);
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await getUserById(req.userId!);
  res.json(user);
}

export async function updateProfileHandler(req: AuthRequest, res: Response) {
  const { fullName } = profileSchema.parse(req.body);
  const user = await updateProfile(req.userId!, fullName);
  res.json(user);
}

export async function changePasswordHandler(req: AuthRequest, res: Response) {
  const body = changePasswordSchema.parse(req.body);
  const result = await changePassword(
    req.userId!,
    body.currentPassword,
    body.newPassword,
  );
  res.json(result);
}

export async function uploadAvatarHandler(req: AuthRequest, res: Response) {
  const avatarUrl = req.body.avatarUrl as string;
  if (!avatarUrl) {
    throw new AuthError(400, "URL ảnh đại diện không được để trống.");
  }
  const user = await uploadAvatar(req.userId!, avatarUrl);
  res.json(user);
}

export async function logoutHandler(req: AuthRequest, res: Response) {
  const result = await logoutUser(req.userId!);
  res.json(result);
}

export async function googleRedirect(req: AuthRequest, res: Response) {
  if (!isGoogleOAuthEnabled) {
    throw new AuthError(503, "Google OAuth chưa được cấu hình.");
  }

  const mode = (req.query.mode as string) === "register" ? "register" : "login";
  const redirectUri =
    (req.query.redirect_uri as string) || "http://localhost:5173/auth/google/callback";

  const url = getGoogleAuthorizationUrl({ mode, redirectUri });
  res.redirect(url);
}

export async function googleCallback(req: AuthRequest, res: Response) {
  const code = req.query.code as string | undefined;
  const stateRaw = req.query.state as string | undefined;
  const error = req.query.error as string | undefined;

  if (error || !code || !stateRaw) {
    const { redirectUri } = stateRaw
      ? decodeGoogleState(stateRaw)
      : { redirectUri: "http://localhost:5173/auth/google/callback" };
    return res.redirect(
      `${redirectUri}?error=${encodeURIComponent(error ?? "Đăng nhập Google thất bại.")}`,
    );
  }

  const state = decodeGoogleState(stateRaw);
  const profile = await handleGoogleCallback(code);
  const { accessToken, user } = await findOrCreateGoogleUser(profile);

  const params = new URLSearchParams({
    access_token: accessToken,
    user: encodeURIComponent(JSON.stringify(user)),
  });

  res.redirect(`${state.redirectUri}?${params.toString()}`);
}

