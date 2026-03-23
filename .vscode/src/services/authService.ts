import axios from "axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import { storageService } from "./storageService";

const API_URL = "http://10.213.26.206:8080/auth";

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, data, {
      timeout: 5000,
    });
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, data, {
      timeout: 5000,
    });

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
