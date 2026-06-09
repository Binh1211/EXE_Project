/**
 * FE-only auth helpers (insecure):
 * - Stores refresh token in localStorage (unsafe vs XSS).
 * - Keeps access token in memory and exposes helpers to refresh it.
 *
 * Use only if you cannot change the backend. See project README for secure alternatives.
 */

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
  (globalThis as any).__ACCESS_TOKEN__ = token;
}

export function clearAccessToken(): void {
  accessToken = null;
  (globalThis as any).__ACCESS_TOKEN__ = null;
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

  const res = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Refresh request failed');
  }

  const data = await res.json();
  if (!data || !data.accessToken) throw new Error('No access token returned');
  setAccessToken(data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  return data.accessToken;
}
