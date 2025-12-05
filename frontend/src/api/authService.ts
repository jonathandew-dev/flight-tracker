import axios from "axios";
import { useMutation } from "@tanstack/react-query"; // ← make sure this is here

// Axios instance
export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    if (!config.headers) config.headers = {};  // ← ensure headers object exists
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
// Types
export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: string; email: string; name?: string | null };
  accessToken: string;
  refreshToken: string;
}

// React Query mutations
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

// Auth token management
export const setAuthToken = (token: string | null, user?: any) => {
  if (token) {
    localStorage.setItem("authToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (user) localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  }
};