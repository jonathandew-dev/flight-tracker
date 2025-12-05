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
  user: null,
  accessToken: null,

  setAuth: (token, user) =>
    set({
      accessToken: token,
      user: user,
    }),

  logout: () =>
    set({
      accessToken: null,
      user: null,
    }),
}));
