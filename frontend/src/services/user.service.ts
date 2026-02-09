import api from "@/libraries/axios";
import { apiPaths } from "@/utils/apiPaths";

interface User {
  _id: string;
  name: string;
  email: string;
  roles: ("member" | "admin" | "creator")[];
  profileImageUrl: string;
}

export const fetchUsersReq = async (): Promise<ApiResponse<User[]>> => {
  try {
    const res = await api.get(apiPaths.users.getAllUsers);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error fetching users" };
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
