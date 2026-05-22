import api from "@/libraries/axios";
import { apiPaths } from "@/utils/apiPaths";

export const getInviteCode = async (inviteData: {
  inviteAs: "admin" | "member";
}): Promise<ApiResponse<string>> => {
  try {
    const res = await api.post(apiPaths.invite.getInviteCode, inviteData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Error fetch new invitation code" };
  }
};
