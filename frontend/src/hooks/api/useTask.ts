import { taskService } from "@/services";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import type {
  StatusOrChecklist,
  StatusSummary,
  Task,
} from "@/services/task.service";
import { toast } from "@/libraries/sweetalert2";
import { getStatusAndProgress } from "@/utils";

/* -------------------------------------------------------------------------- */
/*                                  USE TASK                                  */
/* -------------------------------------------------------------------------- */
export const useTask = (id: string) => {
  const { user } = useAuth();

  return useQuery<Task>({
    queryKey: ["auth", user?._id, "tasks", { id }],
    queryFn: async () => {
      const { data } = await taskService.getTaskById(id);
      return data;
    },
    enabled: !!user,
  });
};

/* -------------------------------------------------------------------------- */
/*                                USE EDIT TASK                               */
/* -------------------------------------------------------------------------- */
export const useEditTask = (id: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Task>, // TData
    ApiError, // TError
    { text: string; completed: boolean }[] // TVariables
  >({
    mutationFn: async (variables) => {
      return taskService.updateTaskStatus({
        taskId: id,
        data: { todoChecklist: variables },
      });
    },
    onMutate: (todoChecklist) => {
      queryClient.setQueryData<Task>(
        ["auth", user?._id, "tasks", { id }],
        (old) => {
          if (!old) return old;

          const [status, progress] = getStatusAndProgress(todoChecklist);
          return { ...old, status, progress, todoChecklist };
        },
      );
    },
    onSuccess: ({ data, message }) => {
      // update tasks array
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

      // invalidate dashboard
      queryClient.invalidateQueries({
        queryKey: ["auth", user?._id, "tasks", "dashboard"],
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
};
