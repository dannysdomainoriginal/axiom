import DashboardLayout from "@/components/partials/DashboardLayout";
import { useAuth } from "@/hooks/api/useAuth";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRole: "member" | "admin";
};

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🚫 Unauthorized</h1>
      <p className="text-gray-600 text-lg">
        Only admins are allowed to access this page
      </p>
    </div>
  );
};

const ProtectedRoute = ({ allowedRole }: Props) => {
  const { loading, user } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  // Admin check
  if (allowedRole === "admin" && !user.roles.includes("admin")) {
    return (
      <DashboardLayout>
        <UnauthorizedPage />
      </DashboardLayout>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
