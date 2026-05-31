import { useCallback, useEffect, useState } from "react";
import {
  AUTH_SESSION_EVENT,
  getStoredUser,
  isAuthenticated as hasAuthToken,
} from "@/features/auth/lib/auth-session";
import type { AuthUser } from "@/features/auth/types";

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const refresh = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener(AUTH_SESSION_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    user,
    isLoggedIn: Boolean(user),
    isAuthenticated: Boolean(user) || hasAuthToken(),
    refresh,
  };
}
