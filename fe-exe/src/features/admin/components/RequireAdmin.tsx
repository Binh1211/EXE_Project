import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthUser } from "../../auth/hooks/useAuthUser";

export function RequireAdmin() {
  const { user } = useAuthUser();
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
