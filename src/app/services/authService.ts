import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import apiClient from "./apiClient";
import { storageService } from "./storageService";

export const authService = {
  async register(data: RegisterRequest) {

    console.log("POST /auth/register with baseURL =", apiClient.defaults.baseURL);
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", data);
    const authData: AuthResponse = response.data;

    if (authData.token) {
      await storageService.saveToken(authData.token);
    }

    return authData;
  },

  async logout() {
    await storageService.removeToken();
  },
};

