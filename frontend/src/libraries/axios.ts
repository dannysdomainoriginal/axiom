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
    console.log("Interceptor caught error:", error);

    // 1. Explicitly identify timeouts and actual network drops
    const isTimeout = error.code === "ECONNABORTED";
    const isNetworkError =
      error.code === "ERR_NETWORK" || (!error.response && !isTimeout);

    // 2. Only show the alert if it's a structural network drop or timeout
    if (isNetworkError || isTimeout) {
      if (!isShowingNetworkError) {
        isShowingNetworkError = true;

        await Swal.fire({
          icon: "error",
          title: isTimeout ? "Request Timeout" : "Network Error",
          text: isTimeout
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

    // Regular HTTP errors (401, 400, 403, 500) bypass the global alert
    // and seamlessly reject down to your local try/catch blocks!
    return Promise.reject(error);
  },
);

export default api;
