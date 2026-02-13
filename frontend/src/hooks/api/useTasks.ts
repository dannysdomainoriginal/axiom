import { taskService } from "@/services";
import { useAuth } from "./useAuth";
import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  StatusOrChecklist,
  StatusSummary,
  Task,
  TaskDashboardStats,
} from "@/services/task.service";
import queryClient from "@/libraries/tanstack";
import { toast } from "@/libraries/sweetalert2";
import type { TaskSchema } from "@/schemas";

type TaskOption =
  | "get-tasks"
  | "dashboard"
  | "user-dashboard"
  | "add-task"
  | "update-task"
  | "update-task-status"
  | "delete-task";

/* -------------------------------------------------------------------------- */
/*                            USETASKS HOOK TYPING                            */
/* -------------------------------------------------------------------------- */

export function useTasks(
  option: "get-tasks",
  query?: Task["status"],
): UseQueryResult<{ tasks: Task[]; statusSummary: StatusSummary }>;

export function useTasks(
  option: "dashboard" | "user-dashboard",
): UseQueryResult<TaskDashboardStats>;

export function useTasks(
  option: "add-task",
): UseMutationResult<ApiResponse<Task>, ApiError, TaskSchema>;

export function useTasks(
  option: "update-task",
): UseMutationResult<
  ApiResponse<Task>,
  ApiError,
  { taskId: string; data: TaskSchema }
>;

export function useTasks(
  option: "update-task-status",
): UseMutationResult<
  ApiResponse<Task>,
  ApiError,
  { taskId: string; data: StatusOrChecklist }
  >;

export function useTasks(
  option: "delete-task",
): UseMutationResult<ApiResponse<Task>, ApiError, string>;

/* -------------------------------------------------------------------------- */
/*                                USETASKS HOOK                               */
/* -------------------------------------------------------------------------- */
export function useTasks(option: TaskOption) {
  const user = useAuth().user!;

  if (option === "get-tasks") {
    return useQuery<{ tasks: Task[]; statusSummary: StatusSummary }>({
      queryKey: ["auth", user?._id, "tasks"],
      queryFn: async () => {
        const { data } = await taskService.getTasks();
        return data;
      },
      enabled: !!user,
    });
  }

  if (option === "dashboard") {
    return useQuery<TaskDashboardStats>({
      queryKey: ["auth", user?._id, "tasks", "dashboard"],
      queryFn: async () => {
        const { data } = await taskService.getDashboardData();
        return data;
      },
      enabled: !!user,
    });
  }

  if (option === "user-dashboard") {
    return useQuery<TaskDashboardStats>({
      queryKey: ["auth", user?._id, "tasks", "dashboard"],
      queryFn: async () => {
        const { data } = await taskService.getUserDashboardData();
        return data;
      },
      enabled: !!user,
    });
  }

  let mutationFn:
    | ((...args: any) => Promise<ApiResponse<taskService.Task>>)
    | undefined;
  let onSuccess: ((res: ApiResponse<taskService.Task>) => void) | undefined;

  if (option === "add-task") {
    mutationFn = taskService.createTask;
    onSuccess = async ({ data, message }: ApiResponse<taskService.Task>) => {
      queryClient.setQueryData<{ tasks: Task[]; statusSummary: StatusSummary }>(
        ["auth", user?._id, "tasks"],
        (old) =>
          old
            ? {
                ...old,
                tasks: [...old.tasks, data],
              }
            : old,
      );

      toast.success(message!);
    };
  } else if (option === "update-task") {
    mutationFn = taskService.updateTask;
    onSuccess = ({ data, message }: ApiResponse<taskService.Task>) => {
      queryClient.setQueryData<{ tasks: Task[]; statusSummary: StatusSummary }>(
        ["auth", user?._id, "tasks"],
        (old) =>
          old
            ? {
                ...old,
                tasks: old.tasks.map((task) =>
                  task._id === data._id ? data : task,
                ),
              }
            : old,
      );

      toast.success(message!);
    };
  } else if (option === "update-task-status") {
    mutationFn = taskService.updateTaskStatus;
    onSuccess = ({ data, message }: ApiResponse<taskService.Task>) => {
      queryClient.setQueryData<{ tasks: Task[]; statusSummary: StatusSummary }>(
        ["auth", user?._id, "tasks"],
        (old) =>
          old
            ? {
                ...old,
                tasks: old.tasks.map((task) =>
                  task._id === data._id ? data : task,
                ),
              }
            : old,
      );

      toast.success(message!);
    };
  } else if (option === "delete-task") {
    mutationFn = taskService.deleteTask;
    onSuccess = ({ data, message }: ApiResponse<taskService.Task>) => {
      queryClient.setQueryData<{ tasks: Task[]; statusSummary: StatusSummary }>(
        ["auth", user?._id, "tasks"],
        (old) =>
          old
            ? {
                ...old,
                tasks: old.tasks.filter((t) => t._id !== data._id),
              }
            : old,
      );

      toast.success(message!);
    };
  }

  if (mutationFn && onSuccess) {
    return useMutation({
      mutationFn,
      onSuccess,
      onError: ({ message }: ApiError) => {
        toast.error(message);
      },
    });
  }

  throw new Error("Invalid or undefined option argument passed in");
}
