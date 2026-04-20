import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { storageService } from "./storageService";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

console.log("API baseURL =", apiClient.defaults.baseURL);

apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(config.method?.toUpperCase(), config.baseURL, config.url)
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;