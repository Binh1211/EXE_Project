import { AUTH_STORAGE_KEYS } from "@/features/auth/constants";
import type { AuthResponse, AuthUser } from "@/features/auth/types";

export const AUTH_SESSION_EVENT = "auth-session-changed";

// ─────────────────────────────────────────────
// JWT helpers (client-side, no secret needed)
// ─────────────────────────────────────────────
function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

/** Returns true if the token has already expired (or is about to, within 30 s) */
export function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 < Date.now() + bufferSeconds * 1000;
}

// ─────────────────────────────────────────────
// Session helpers
// ─────────────────────────────────────────────
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

export function setAccessToken(token: string) {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, token);
  // do NOT notify here — caller should decide if full session event is needed
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

/**
 * Returns true only when:
 * 1. An access token exists in localStorage AND
 * 2. That token has NOT yet expired (with a 30-second buffer).
 *
 * If the token is expired we still return `true` here so the app can attempt
 * a silent refresh instead of immediately redirecting to /login.
 * `RequireAuth` performs the actual silent-refresh check.
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  // Even an expired token means "was logged in" — let RequireAuth handle refresh
  return true;
}

export function updateStoredUser(user: AuthUser) {
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
  notifySessionChange();
}

export { getApiErrorMessage as getAuthErrorMessage } from "@/lib/api-client";
