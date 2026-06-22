import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AUTH_ROUTES } from "@/features/auth/constants";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  isTokenExpired,
  saveAuthSession,
  setAccessToken,
} from "@/features/auth/lib/auth-session";
import { API_BASE_URL } from "@/lib/api-client";

type RequireAuthProps = {
  children: React.ReactNode;
};

/**
 * Gate that:
 * 1. If no token → redirect to /login.
 * 2. If token is still valid → render children immediately.
 * 3. If token is expired → attempt a silent refresh using the httpOnly cookie.
 *    - On success → update localStorage and render children.
 *    - On failure → clear session and redirect to /login.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const token = getAccessToken();

  // No token at all — hard redirect
  if (!token) {
    return <Navigate to={AUTH_ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  // Token still valid — render immediately (no loading flash)
  if (!isTokenExpired(token)) {
    return <>{children}</>;
  }

  // Token expired — need async silent refresh
  return (
    <SilentRefreshGate from={location.pathname}>
      {children}
    </SilentRefreshGate>
  );
}

// ─────────────────────────────────────────────
// Internal: async refresh component
// ─────────────────────────────────────────────
type GateState = "loading" | "ok" | "fail";

function SilentRefreshGate({
  children,
  from,
}: {
  children: React.ReactNode;
  from: string;
}) {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function tryRefresh() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include", // sends httpOnly refresh_token cookie
        });

        if (!res.ok) throw new Error("Refresh failed");

        const data = await res.json().catch(() => null) as any;
        if (!data?.accessToken) throw new Error("No access token in response");

        // Persist new access token; if BE also returns user keep it in sync
        setAccessToken(data.accessToken);
        if (data.user) {
          saveAuthSession({ accessToken: data.accessToken, user: data.user });
        } else {
          // Re-use stored user data — it's still valid
          const user = getStoredUser();
          if (user) saveAuthSession({ accessToken: data.accessToken, user });
          else {
            // As a last resort, fetch /me to restore user
            const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${data.accessToken}` },
              credentials: "include",
            });
            if (meRes.ok) {
              const me = await meRes.json();
              saveAuthSession({ accessToken: data.accessToken, user: me });
            }
          }
        }

        if (!cancelled) setState("ok");
      } catch {
        if (!cancelled) {
          clearAuthSession();
          setState("fail");
        }
      }
    }

    tryRefresh();
    return () => { cancelled = true; };
  }, []);

  if (state === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid #e5e7eb",
            borderTopColor: "#5f3713",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state === "fail") {
    return <Navigate to={AUTH_ROUTES.login} replace state={{ from }} />;
  }

  return <>{children}</>;
}
