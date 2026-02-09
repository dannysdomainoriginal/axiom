import { baseURL } from "@/utils/apiPaths";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

export default api;
