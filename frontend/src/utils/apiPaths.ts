export const baseURL = import.meta.env.DEV
  ? "http://localhost:8001/api"
  : "/api";

export const apiPaths = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    getProfile: "/auth/profile",
    updateProfile: "/auth/profile",
  },

  users: {
    getAllUsers: "/users",
    getUsersProfileImages: "/users",
    getUserById: (userId: string) => `/users/${userId}`,
    createUser: "/users",
    updateUser: (userId: string) => `/users/${userId}`,
    deleteUser: (userId: string) => `/users/${userId}`,
  },

  tasks: {
    getDashboardData: "/tasks/dashboard-data",
    getUserDashboardData: "/tasks/user-dashboard-data",
    getAllTasks: "/tasks",
    getTaskById: (taskId: string) => `/tasks/${taskId}`,
    createTask: "/tasks",
    updateTask: (taskId: string) => `/tasks/${taskId}`,
    deleteTask: (taskId: string) => `/tasks/${taskId}`,

    updateTaskStatus: (taskId: string) => `/tasks/${taskId}/status`,
  },

  reports: {
    exportTasks: "/reports/tasks/export",
    exportUsers: "/reports/users/export",
  },

  invite: {
    getInviteCode: "/invite/new"
  }
};
