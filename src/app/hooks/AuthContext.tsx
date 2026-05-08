import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { storageService } from "../services/storageService";
import { userService } from "../services/userService";
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

/** Provides authentication state and actions to the app. */
export default function AuthProvider({
    children,
}: {children: React.ReactNode;}) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const loadStoredAuth = async () => {
        try {
          const savedToken = await storageService.getToken();

          if (savedToken) {
            setToken(savedToken);

            const currentUser = await userService.getMe();
            setUser(currentUser);
          }
        } catch (error) {
          console.log("LOAD AUTH ERROR:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadStoredAuth();
    }, []);

    /** Logs in the user and stores their token and profile. */
    const login = async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await authService.login(data);
      setUser(response.user);
      setToken(response.token);
      return response;
    };

    /** Registers a new user account. */
    const register = async (data: RegisterRequest) => {
      return await authService.register(data);
    };

    /** Logs out the user and clears stored auth state. */
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

/** Hook to access the auth context. Must be used inside AuthProvider. */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
