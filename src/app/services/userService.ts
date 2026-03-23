import { UserResponse } from "../types/auth";
import apiClient from "./apiClient";

export const userService = {
  async getMe(): Promise<UserResponse> {
    console.log("GET /auth/me with baseURL =", apiClient.defaults.baseURL);
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};