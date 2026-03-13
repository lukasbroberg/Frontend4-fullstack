import axios from "axios";
import { storageService } from "./storageService";

const apiClient = axios.create({
  baseURL: "http://10.24.73.206:8080",
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;