
export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: UserResponse;
};
/*export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}*/