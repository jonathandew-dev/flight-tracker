import axios from "axios";
import { useMutation } from "@tanstack/react-query";

// Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (!config.headers) config.headers = new axios.AxiosHeaders();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

// Types
export interface AuthPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// React Query hooks
export const useLogin = () =>
  useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload: AuthPayload) => {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      return response.data;
    },
  });

export const useRegister = () =>
  useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload: AuthPayload) => {
      const response = await api.post<AuthResponse>("/auth/register", payload);
      return response.data;
    },
  });

export const useUpdateUser = () => {
  return useMutation<User, Error, { name?: string | null }>({
    mutationFn: async (data) => {
      const response = await api.patch<User>("/api/users/me", data);
      return response.data;
    },
  });
};


// Token management
export const setAuthToken = (token: string | null, user?: User) => {
  if (token) {
    localStorage.setItem("authToken", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  }
};
