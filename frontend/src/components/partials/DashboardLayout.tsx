import React from "react";
import { useAuth } from "@/hooks/api/useAuth";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="">
      <Navbar />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu />
          </div>

          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
