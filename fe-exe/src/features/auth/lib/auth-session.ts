import { AUTH_STORAGE_KEYS } from "@/features/auth/constants";
import type { AuthResponse, AuthUser } from "@/features/auth/types";

export const AUTH_SESSION_EVENT = "auth-session-changed";

function notifySessionChange() {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function saveAuthSession(response: AuthResponse) {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, response.accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(response.user));
  notifySessionChange();
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  notifySessionChange();
}

export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function updateStoredUser(user: AuthUser) {
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
  notifySessionChange();
}

export { getApiErrorMessage as getAuthErrorMessage } from "@/lib/api-client";
