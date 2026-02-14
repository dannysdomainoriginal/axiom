
import { userService } from "@/services";
import type { UserWithTaskCounts } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useUsers() {
  const { user } = useAuth();

  return useQuery<UserWithTaskCounts[]>({
    queryKey: ["auth", user?._id, "users"],
    queryFn: async () => {
      const { data } = await userService.fetchUsersReq();
      return data;
    },
    enabled: !!user,
    refetchOnMount: true, // aggresively prevent stale users data
  });
}
