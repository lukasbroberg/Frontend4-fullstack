import axios from "axios";
import { storageService } from "./storageService";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
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