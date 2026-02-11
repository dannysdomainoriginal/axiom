import DashboardLayout from "@/components/partials/DashboardLayout";
import { useAuth } from "@/hooks/api/useAuth";
import React from "react";

const DashboardPage = () => {
  const { user } = useAuth();

  return <div>DashboardPage</div>;
};

export default DashboardPage;
