// src/store/authStore.ts
import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
};
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (!config.headers) config.headers = new axios.AxiosHeaders();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

// --------------------
// Helpers for localStorage
// --------------------
const getUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

const getTokenFromStorage = (): string | null => localStorage.getItem("authToken");

// --------------------
// Zustand store
// --------------------
export const useAuthStore = create<AuthState>((set) => ({
  user: getUserFromStorage(),
  accessToken: getTokenFromStorage(),

  setAuth: (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    set({ accessToken: token, user });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    set({ accessToken: null, user: null });
  },
}));

// --------------------
// Restore auth on page load
// --------------------
export const restoreAuth = () => {
  const token = getTokenFromStorage();
  const user = getUserFromStorage();

  if (token && user) {
    useAuthStore.getState().setAuth(token, user);
  }
};