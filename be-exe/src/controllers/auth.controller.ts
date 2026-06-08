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
import { env, isGoogleOAuthEnabled } from "../config/env.js";

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
  // set refresh token cookie if provided
  if ((result as any).refreshToken) {
    const raw = (result as any).refreshToken as string;
    // decode exp to set cookie maxAge
    const decoded: any = await import("jsonwebtoken").then((jwt) => jwt.default.decode(raw));
    const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : undefined;
      const cookieOptions: any = {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        path: "/",
        ...(maxAge ? { maxAge } : {}),
      };
      if (env.cookieDomain) cookieOptions.domain = env.cookieDomain;
      res.cookie("refresh_token", raw, cookieOptions);
  }
  res.status(201).json({ accessToken: result.accessToken, user: result.user });
}

export async function login(req: AuthRequest, res: Response) {
  const body = loginSchema.parse(req.body);
  const result = await loginUser(body.email, body.password);
  if ((result as any).refreshToken) {
    const raw = (result as any).refreshToken as string;
    const decoded: any = await import("jsonwebtoken").then((jwt) => jwt.default.decode(raw));
    const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : undefined;
      const cookieOptions: any = {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        path: "/",
        ...(maxAge ? { maxAge } : {}),
      };
      if (env.cookieDomain) cookieOptions.domain = env.cookieDomain;
      res.cookie("refresh_token", raw, cookieOptions);
  }
  res.json({ accessToken: result.accessToken, user: result.user });
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
  // Clear refresh cookie on logout
  const clearOptions: any = { path: "/" };
  if (env.cookieDomain) clearOptions.domain = env.cookieDomain;
  res.clearCookie("refresh_token", clearOptions);
  res.json(result);
}

export async function googleOAuthStatusHandler(_req: AuthRequest, res: Response) {
  res.json({ enabled: isGoogleOAuthEnabled });
}

export async function googleRedirect(req: AuthRequest, res: Response) {
  if (!isGoogleOAuthEnabled) {
    throw new AuthError(503, "Google OAuth chưa được cấu hình.");
  }

  const mode = (req.query.mode as string) === "register" ? "register" : "login";
  const redirectUri =
    (req.query.redirect_uri as string) || `${env.clientUrl}/auth/google/callback`;

  const url = getGoogleAuthorizationUrl({ mode, redirectUri });
  res.redirect(url);
}

export async function googleCallback(req: AuthRequest, res: Response) {
  const code = req.query.code as string | undefined;
  const stateRaw = req.query.state as string | undefined;
  const oauthError = req.query.error as string | undefined;

  let redirectUri = `${env.clientUrl}/auth/google/callback`;

  try {
    if (stateRaw) {
      redirectUri = decodeGoogleState(stateRaw).redirectUri;
    }

    if (oauthError || !code || !stateRaw) {
      return res.redirect(
        `${redirectUri}?error=${encodeURIComponent(oauthError ?? "Đăng nhập Google thất bại.")}`,
      );
    }

    const state = decodeGoogleState(stateRaw);
    redirectUri = state.redirectUri;
    const profile = await handleGoogleCallback(code);
    const { accessToken, user, refreshToken } = await findOrCreateGoogleUser(profile, state.mode) as any;

    if (refreshToken) {
      const decoded: any = await import("jsonwebtoken").then((jwt) => jwt.default.decode(refreshToken));
      const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : undefined;
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/",
        ...(maxAge ? { maxAge } : {}),
      });
    }

    const params = new URLSearchParams({
      access_token: accessToken,
      user: encodeURIComponent(JSON.stringify(user)),
    });

    return res.redirect(`${redirectUri}?${params.toString()}`);
  } catch (err) {
    const message =
      err instanceof AuthError ? err.message : "Đăng nhập Google thất bại.";
    return res.redirect(`${redirectUri}?error=${encodeURIComponent(message)}`);
  }
}

