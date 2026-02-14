import { useAuth } from "@/hooks/api/useAuth";
import { Navigate, Outlet } from "react-router-dom";

type AuthRouteProps = {
  allowedRoles: string[];
};

const AuthRoute = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return null;
  }

  return !user ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        !user
          ? "/login"
          : user.roles.includes("admin")
            ? "/admin/dashboard"
            : "/user/dashboard"
      }
    />
  );
};

export default AuthRoute;
