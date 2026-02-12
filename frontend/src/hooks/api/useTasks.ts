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
import type { TaskSchema, UpdateTaskSchema } from "@/schemas";

type TaskOption =
  | "get-tasks"
  | "dashboard"
  | "user-dashboard"
  | "add-task"
  | "update-task"
  | "update-task-status";

/* -------------------------------------------------------------------------- */
/*                            USETASKS HOOK TYPING                            */
/* -------------------------------------------------------------------------- */

export function useTasks(
  option: "get-tasks",
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
  { taskId: string; data: UpdateTaskSchema }
  >;

export function useTasks(
  option: "update-task-status",
): UseMutationResult<
  ApiResponse<Task>,
  ApiError,
  { taskId: string; data: StatusOrChecklist }
>;

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
    onSuccess = ({ data, message }: ApiResponse<taskService.Task>) => {
      queryClient.setQueryData<Task[]>(
        ["auth", user?._id, "tasks"],
        (old = []) => [...old, data],
      );
      toast.success(message!);
    };
  } else if (option === "update-task") {
    mutationFn = taskService.updateTask;
    onSuccess = ({ data, message }: ApiResponse<taskService.Task>) => {
      queryClient.setQueryData<Task[]>(
        ["auth", user?._id, "tasks"],
        (old = []) => old.map((task) => (task._id === data._id ? data : task)),
      );
      toast.success(message!);
    };
  } else if (option === "update-task-status") {
    mutationFn = taskService.updateTaskStatus;
    onSuccess = ({ data, message }: ApiResponse<taskService.Task>) => {
      queryClient.setQueryData<Task[]>(
        ["auth", user?._id, "tasks"],
        (old = []) => old.map((task) => (task._id === data._id ? data : task)),
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
