// src/hooks/useAuthInit.ts
import { useEffect } from "react";
import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";


// -----------------------------
// Axios instance
// -----------------------------
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Attach token dynamically from localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");

    if (!config.headers){
      config.headers = new AxiosHeaders();
    }

    if (token) {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  }
);

// -----------------------------
// Types
// -----------------------------
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
  refreshToken?: string;
}

// -----------------------------
// React Query hooks
// -----------------------------
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload: AuthPayload) => {
      const res = await api.post<AuthResponse>("/auth/login", payload);
      const { accessToken, user } = res.data;

      // Save to Zustand + localStorage
      setAuth(accessToken, user);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return res.data;
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload: AuthPayload) => {
      const res = await api.post<AuthResponse>("/auth/register", payload);
      const { accessToken, user } = res.data;

      setAuth(accessToken, user);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return res.data;
    },
  });
};

// -----------------------------
// Hook to initialize auth on app load
// -----------------------------
export const useAuthInit = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuth(token, JSON.parse(user));
    }
  }, [setAuth]); // ✅ include setAuth in deps to satisfy ESLint
};
