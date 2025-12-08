import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("authToken"),
  
  setAuth: (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken: token, user });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    set({ accessToken: null, user: null });
  },
}));
