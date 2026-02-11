import api from "@/libraries/axios";
import { apiPaths } from "@/utils/apiPaths";

export type Task = {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string; // backend sends ISO string
  createdBy: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    profileImageUrl: string;
  }[];
  progress: number;
  attachments: string[];
  todoChecklist: {
    text: string;
    completed: boolean;
  }[];
  completedTodoCount?: number; // optional, backend calculates this
  createdAt: Date
};

export type TaskDashboardStats = {
  statistics: {
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  charts: {
    taskDistribution: {
      Pending: number;
      InProgress: number;
      Completed: number;
      All: number;
    };
    taskPriorityLevels: {
      Low: number;
      Medium: number;
      High: number;
    };
  };
  recentTasks: Pick<
    Task,
    "title" | "status" | "priority" | "dueDate" | "createdAt"
  >[];
};

// ------------------- TASK SERVICES -------------------

export const getTasks = async (
  status?: "Pending" | "In Progress" | "Completed",
): Promise<ApiResponse<{ tasks: Task[]; statusSummary: any }>> => {
  try {
    const res = await api.get(apiPaths.tasks.getAllTasks, {
      params: status ? { status } : {},
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching tasks" };
  }
};

export const getTaskById = async (
  taskId: string,
): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.get(apiPaths.tasks.getTaskById(taskId));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching task" };
  }
};

export const createTask = async (
  taskData: Partial<Task>,
): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.post(apiPaths.tasks.createTask, taskData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error creating task" };
  }
};

export const updateTask = async (
  taskId: string,
  taskData: Partial<Task>,
): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.patch(apiPaths.tasks.updateTask(taskId), taskData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error updating task" };
  }
};

export const deleteTask = async (
  taskId: string,
): Promise<ApiResponse<undefined>> => {
  try {
    const res = await api.delete(apiPaths.tasks.deleteTask(taskId));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error deleting task" };
  }
};

export const updateTaskStatus = async (
  taskId: string,
  status: "Pending" | "In Progress" | "Completed",
  todoChecklist?: { text: string; completed: boolean }[],
): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.patch(apiPaths.tasks.updateTaskStatus(taskId), {
      status,
      todoChecklist,
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error updating task status" };
  }
};

// ------------------- DASHBOARD -------------------

export const getDashboardData = async (): Promise<
  ApiResponse<TaskDashboardStats>
> => {
  try {
    const res = await api.get(apiPaths.tasks.getDashboardData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching dashboard data" };
  }
};

export const getUserDashboardData = async (): Promise<
  ApiResponse<TaskDashboardStats>
> => {
  try {
    const res = await api.get(apiPaths.tasks.getUserDashboardData);
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || { message: "Error fetching user dashboard data" }
    );
  }
};
