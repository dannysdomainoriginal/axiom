import { baseURL } from "@/utils/apiPaths";
import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

let isShowingNetworkError = false;

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    console.log(error)
    if (!error.response) {
      if (!isShowingNetworkError) {
        isShowingNetworkError = true;

        await Swal.fire({
          icon: "error",
          title: "Network Error",
          text:
            error.code === "ECONNABORTED"
              ? "Request timed out. Please try again."
              : "Unable to reach the server. Check your connection.",
          confirmButtonText: "I understand",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didClose: () => {
            isShowingNetworkError = false;
          },
        });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
