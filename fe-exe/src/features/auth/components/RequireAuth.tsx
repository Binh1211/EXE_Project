import { Navigate, useLocation } from "react-router-dom";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { isAuthenticated } from "@/features/auth/lib/auth-session";

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to={AUTH_ROUTES.login}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
