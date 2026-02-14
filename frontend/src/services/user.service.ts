import api from "@/libraries/axios";
import { apiPaths } from "@/utils/apiPaths";

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: ("member" | "admin" | "creator")[];
  profileImageUrl: string;
}

export interface UserWithTaskCounts extends User {
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

export const fetchUsersReq = async (): Promise<
  ApiResponse<UserWithTaskCounts[]>
> => {
  try {
    const res = await api.get(apiPaths.users.getAllUsers);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching users" };
  }
};

export const fetchUsersProfileImages = async (): Promise<
  ApiResponse<Pick<User, "_id" | "name" | "email" | "profileImageUrl">[]>
> => {
  try {
    const res = await api.get(apiPaths.users.getUsersProfileImages);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching users' images" };
  }
};

export const fetchUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const res = await api.get(apiPaths.users.getUserById(id));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching this user" };
  }
};

export const deleteUserById = async (
  id: string,
): Promise<ApiResponse<undefined>> => {
  try {
    const res = await api.delete(apiPaths.users.deleteUser(id));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching this user" };
  }
};
