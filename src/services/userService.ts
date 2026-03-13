import { UserResponse } from "../types/auth";
import apiClient from "./apiClient";

export const userService = {
  async getMe(): Promise<UserResponse> {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};