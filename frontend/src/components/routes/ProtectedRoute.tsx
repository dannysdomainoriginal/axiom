import { useAuth } from "@/hooks/api/useAuth";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRole: "member" | "admin";
};

const ProtectedRoute = ({ allowedRole }: Props) => {
  const { loading, user } = useAuth();

  // TODO return a better loadingState
  if (loading) {
    return null;
  }

  if (user && allowedRole === "admin") {
    // TODO return a better unauthorized page
    return user.roles.includes(allowedRole) ? <Outlet /> : <p>Unauthorized</p>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
