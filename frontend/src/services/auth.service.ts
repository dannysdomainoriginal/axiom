import api from "@/libraries/axios";
import { apiPaths } from "@/utils/apiPaths";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    roles: ("member" | "admin" | "creator")[];
    profileImageUrl: string;
  };
};

export const loginReq = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const res = await api.post(apiPaths.auth.login, { email, password });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error logging you in" };
  }
};

export const signupReq = async (formData: FormData): Promise<AuthResponse> => {
  try {
    const res = await api.post(apiPaths.auth.register, formData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Failed to sign you up" };
  }
};

export const getProfile = async (): Promise<AuthResponse> => {
  try {
    const res = await api.get(apiPaths.auth.getProfile);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Error fetching your profile" };
  }
};

export const updateProfile = async (
  formData: FormData,
): Promise<AuthResponse> => {
  try {
    const res = await api.patch(apiPaths.auth.updateProfile, formData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Error updating your profile" };
  }
};
