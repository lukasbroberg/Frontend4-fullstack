import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { storageService } from "../services/storageService";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../types/auth";

type AuthContextType = {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const savedToken = await storageService.getToken();

        if (savedToken) {
          setToken(savedToken);

          // Nếu backend có endpoint /user/me thì nên gọi ở đây
          // const currentUser = await authService.getMe();
          // setUser(currentUser);
        }
      } catch (error) {
        console.log("LOAD AUTH ERROR:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await authService.login(data);
    setUser(response.user);
    setToken(response.token);
    return response;
  };

  const register = async (data: RegisterRequest) => {
    return await authService.register(data);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
