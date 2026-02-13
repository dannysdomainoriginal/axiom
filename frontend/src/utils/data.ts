import type { IconType } from "react-icons/lib";
import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
} from "react-icons/lu";

interface Tab {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

export const adminMenuData: Tab[] = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },

  {
    id: "02",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },

  {
    id: "03",
    label: "Create Task",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },

  {
    id: "04",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },

  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const userMenuData: Tab[] = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },

  {
    id: "02",
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },

  {
    id: "03",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

interface Priority {
  label: "Low" | "Medium" | "High";
  value: "Low" | "Medium" | "High";
}

export const priorityData: Priority[] = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

interface Status {
  label: "Pending" | "In Progress" | "Completed";
  value: "Pending" | "In Progress" | "Completed";
}

export const statusData: Status[] = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];
