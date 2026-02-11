import { useAuth } from "@/hooks/api/useAuth";
import { adminMenuData, userMenuData } from "@/utils/data";
import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

const SideMenu = () => {
  const { user, clearUser } = useAuth();

  const sideMenuData = useMemo(() => {
    if (user) {
      return user?.roles.includes("admin") ? adminMenuData : userMenuData;
    }
    return [];
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-15.25 z-20 flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImageUrl || "/images/default.jpg"}
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        </div>

        {user?.roles.includes("admin") && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {/* Menu Links */}
      <div className="flex-1">
        {sideMenuData
          .filter((item) => item.path !== "logout")
          .map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-2 transition-all duration-200 border-r-4
                ${
                  isActive
                    ? "text-primary bg-linear-to-r from-blue-50/60 to-blue-100/60 border-primary font-medium"
                    : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-primary hover:border-primary/40"
                }`
              }
            >
              <item.icon className="text-sm" />
              {item.label}
            </NavLink>
          ))}
      </div>

      {/* Logout Button (Bottom) */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={clearUser}
          className="w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg text-red-600 transition-all duration-200 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:shadow-sm active:scale-[0.98]"
        >
          <LuLogOut className="text-sm" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
