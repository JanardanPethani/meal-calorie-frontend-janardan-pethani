import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, registerUser } from "../api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginUser({ email, password });

          if (response.success && response.user) {
            // Store token in localStorage
            localStorage.setItem("token", response.user.token);

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ error: "Login failed", isLoading: false });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
        }
      },

      register: async (firstName, lastName, email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await registerUser({
            firstName,
            lastName,
            email,
            password,
          });

          if (response.success && response.user) {
            // Store token in localStorage
            localStorage.setItem("token", response.user.token);

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ error: "Registration failed", isLoading: false });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
        }
      },

      logout: () => {
        // Remove token from localStorage
        localStorage.removeItem("token");

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
