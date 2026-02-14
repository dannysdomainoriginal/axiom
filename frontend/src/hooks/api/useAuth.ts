import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import type { AuthResponse } from "@/services/auth.service";

type User = AuthResponse["data"];

interface AuthContext {
  user: User | null;
  loading: boolean;
  updateUser: (data: User) => void;
  clearUser: () => void;
  isAdmin: boolean
}

export const useAuth = (): AuthContext => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const { data } = await authService.getProfile();
        return data;
      } catch {
        return null;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 15 * 60 * 1000, // automatically refresh every 15 mins
    retry: false, // optional, avoid multiple failed retries
  });

  const updateUser = (data: User) => {
    queryClient.setQueryData(["auth"], data);
  };

  const clearUser = () => {
    queryClient.setQueryData<User | null>(["auth"], null);
    queryClient.removeQueries({ queryKey: ["auth"] })
  };

  return {
    user: user ?? null,
    loading: isLoading,
    updateUser,
    clearUser,
    isAdmin: !!(user && user.roles.includes("admin"))
  };
};
