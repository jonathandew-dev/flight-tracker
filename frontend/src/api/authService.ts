import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

// Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // or use store if inside a hook
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
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload: AuthPayload) => {
      const res = await api.post<AuthResponse>("/auth/login", payload);
      const { accessToken, user } = res.data;

      setAuth(accessToken, user); // updates store & localStorage
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      return res.data;
    },
  });
};


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
export const restoreAuth = () => {
  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");

  if (token && userStr) {
    const user = JSON.parse(userStr);
    useAuthStore.getState().setAuth(token, user); // update Zustand store
    setAuthToken(token, user);                   // update Axios headers
  }
};