import api from "@/libraries/axios";
import type { TaskSchema } from "@/schemas";
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
  createdAt: Date;
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

export type StatusSummary = {
  all: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
};

// ------------------- TASK SERVICES -------------------

export const getTasks = async (
  status?: "Pending" | "In Progress" | "Completed",
): Promise<ApiResponse<{ tasks: Task[]; statusSummary: StatusSummary }>> => {
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
  taskData: TaskSchema,
): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.post(apiPaths.tasks.createTask, taskData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error creating task" };
  }
};

type UpdateTask = { taskId: string; data: TaskSchema };

export const updateTask = async ({
  taskId,
  data,
}: UpdateTask): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.patch(apiPaths.tasks.updateTask(taskId), data);
    console.log(res.data)
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error updating task" };
  }
};

export const deleteTask = async (
  taskId: string,
): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.delete(apiPaths.tasks.deleteTask(taskId));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error deleting task" };
  }
};

export type StatusOrChecklist =
  | { status: Task["status"]; todoChecklist: never }
  | { status: never; todoChecklist: Task["todoChecklist"] };

type UpdateTaskStatus = { taskId: string; data: StatusOrChecklist };

export const updateTaskStatus = async ({
  taskId,
  data,
}: UpdateTaskStatus): Promise<ApiResponse<Task>> => {
  try {
    const res = await api.patch(apiPaths.tasks.updateTaskStatus(taskId), data);
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
