// src/api/authService.ts
import { useMutation } from "@tanstack/react-query";
import { useAuthStore, api } from "@/store/authStore"; // <-- shared Axios

// --------------------
// Types
// --------------------
export interface AuthPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}


export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

// --------------------
// React Query hooks
// --------------------

// Login
export const useLogin = () => {
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);

      // normalize user fields
      const normalizedUser: User = {
        ...data.user,
        firstName: data.user.firstName ?? null,
        lastName: data.user.lastName ?? null,
      };

      return {
        ...data,
        user: normalizedUser,
      };
    },
  });
};
// Register
export const useRegister = () => {
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      return data; // don't call setAuth here
    },
  });
};

// Update User
export const useUpdateUser = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<User, Error, { firstName?: string | null; lastName?: string | null }>({
    mutationFn: async (payload) => {
      const { data } = await api.patch<User>("/api/users/me", payload);

      const normalizedUser: User = {
        ...data,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
      };

      setUser(normalizedUser);
      return normalizedUser;
    },
  });
};

// Change Password
export const useChangePassword = () => {
  return useMutation<void, Error, { currentPassword: string; newPassword: string }>({
    mutationFn: async (payload) => {
      await api.post("/api/users/change-password", payload);
    },
  });
};

// Restore Auth on app load
export const restoreAuth = () => {
  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");

  if (token && userStr) {
    const parsed = JSON.parse(userStr);
    const user: User = {
      ...parsed,
      firstName: parsed.firstName ?? null,
      lastName: parsed.lastName ?? null,
    };
    useAuthStore.getState().setAuth(token, user);
  }
};