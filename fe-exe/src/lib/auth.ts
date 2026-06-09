/**
 * FE-only auth helpers (insecure):
 * - Stores refresh token in localStorage (unsafe vs XSS).
 * - Keeps access token in memory and exposes helpers to refresh it.
 *
 * Use only if you cannot change the backend. See project README for secure alternatives.
 */

let accessToken: string | null = null;
let refreshTimer: number | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
  (globalThis as any).__ACCESS_TOKEN__ = token;
  scheduleRefreshForToken(token);
}

export function clearAccessToken(): void {
  accessToken = null;
  (globalThis as any).__ACCESS_TOKEN__ = null;
  cancelScheduledRefresh();
}

function parseJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(b64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function scheduleRefreshForToken(token: string) {
  cancelScheduledRefresh();
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return;
  const expiresAt = payload.exp * 1000;
  const now = Date.now();
  // refresh 60 seconds before expiry, or immediately if already expired
  const refreshAt = Math.max(0, expiresAt - now - 60000);
  // cap minimal delay to 1s
  const delay = Math.max(1000, refreshAt);
  refreshTimer = window.setTimeout(async () => {
    try {
      await refreshAccessToken();
    } catch (err) {
      console.warn('Scheduled token refresh failed:', err);
      clearAccessToken();
      clearRefreshToken();
      // optional: redirect to login to recover
      window.location.href = '/login';
    }
  }, delay) as unknown as number;
}

function cancelScheduledRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer as number);
    refreshTimer = null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem('refresh_token');
  } catch (e) {
    return null;
  }
}

export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem('refresh_token', token);
  } catch (e) {
    // ignore
  }
}

export function clearRefreshToken(): void {
  try {
    localStorage.removeItem('refresh_token');
  } catch (e) {
    // ignore
  }
}

/**
 * Call backend refresh endpoint (FE-only flow). Backend must accept
 * { refreshToken } in body and return { accessToken, refreshToken? }.
 */
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');
  try {
    // Primary attempt: rely on refresh cookie (server stores refresh token in httpOnly cookie)
    const res = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // include cookies so server can read httpOnly refresh cookie
      credentials: 'include',
      // also send stored refresh token in body as a harmless fallback
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn('refreshAccessToken: refresh failed', res.status, text);
      throw new Error(text || 'Refresh request failed');
    }

    const data = await res.json().catch(() => ({}));
    if (!data || !data.accessToken) {
      throw new Error('No access token returned');
    }
    setAccessToken(data.accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
    return data.accessToken;
  } catch (err) {
    console.error('refreshAccessToken error:', err);
    throw err;
  }
}
