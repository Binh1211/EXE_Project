import { API_BASE_URL, apiRequest } from "@/lib/api-client";
import type {
  AuthResponse,
  GoogleAuthMode,
  LoginRequest,
  RegisterRequest,
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
   * Redirect sang BE để bắt đầu Google OAuth.
   * BE cần implement: GET /api/auth/google?mode=login|register&redirect_uri=...
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

export function saveAuthSession(response: AuthResponse) {
  localStorage.setItem("access_token", response.accessToken);
  localStorage.setItem("auth_user", JSON.stringify(response.user));
}

export function clearAuthSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_user");
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === "Failed to fetch") {
      return "Không thể kết nối server. Vui lòng kiểm tra backend đã chạy chưa.";
    }
    return error.message;
  }
  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
