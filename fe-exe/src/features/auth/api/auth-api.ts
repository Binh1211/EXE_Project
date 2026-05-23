import { API_BASE_URL, apiRequest } from "@/lib/api-client";
import {
  saveAuthSession,
  updateStoredUser,
} from "@/features/auth/lib/auth-session";
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  GoogleAuthMode,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from "@/features/auth/types";

const AUTH_PREFIX = "/api/auth";

export const authApi = {
  /** POST /api/auth/login */
  login(payload: LoginRequest) {
    return apiRequest<AuthResponse>(`${AUTH_PREFIX}/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** POST /api/auth/register */
  register(payload: RegisterRequest) {
    return apiRequest<AuthResponse>(`${AUTH_PREFIX}/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /api/auth/forgot-password
   * BE gửi email chứa link: {FE_ORIGIN}/forgot-password/reset?token=...
   */
  forgotPassword(payload: ForgotPasswordRequest) {
    return apiRequest<MessageResponse>(`${AUTH_PREFIX}/forgot-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** POST /api/auth/reset-password */
  resetPassword(payload: ResetPasswordRequest) {
    return apiRequest<MessageResponse>(`${AUTH_PREFIX}/reset-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** GET /api/auth/me */
  getMe() {
    return apiRequest<AuthUser>(`${AUTH_PREFIX}/me`);
  },

  /** PUT /api/auth/profile */
  updateProfile(payload: UpdateProfileRequest) {
    return apiRequest<AuthUser>(`${AUTH_PREFIX}/profile`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /** POST /api/auth/avatar (update avatar url) */
  uploadAvatar(avatarUrl: string) {
    return apiRequest<AuthUser>(`${AUTH_PREFIX}/avatar`, {
      method: "POST",
      body: JSON.stringify({ avatarUrl }),
    });
  },

  /** PUT /api/auth/change-password */
  changePassword(payload: ChangePasswordRequest) {
    return apiRequest<MessageResponse>(`${AUTH_PREFIX}/change-password`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /** POST /api/auth/logout (optional — BE có thể revoke token) */
  logout() {
    return apiRequest<MessageResponse>(`${AUTH_PREFIX}/logout`, {
      method: "POST",
    });
  },

  /**
   * GET /api/auth/google?mode=login|register&redirect_uri=...
   * BE redirect sang Google OAuth, sau đó về /auth/google/callback
   */
  startGoogleAuth(mode: GoogleAuthMode) {
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      mode,
      redirect_uri: redirectUri,
    });

    window.location.assign(
      `${API_BASE_URL}${AUTH_PREFIX}/google?${params.toString()}`,
    );
  },
};

export async function loginAndSave(payload: LoginRequest) {
  const response = await authApi.login(payload);
  saveAuthSession(response);
  return response;
}

export async function registerAndSave(payload: RegisterRequest) {
  const response = await authApi.register(payload);
  saveAuthSession(response);
  return response;
}

export async function updateProfileAndSave(payload: UpdateProfileRequest) {
  const user = await authApi.updateProfile(payload);
  updateStoredUser(user);
  return user;
}

// Re-export session helpers for convenience
export {
  clearAuthSession,
  getAuthErrorMessage,
  getStoredUser,
  isAuthenticated,
  saveAuthSession,
} from "@/features/auth/lib/auth-session";
