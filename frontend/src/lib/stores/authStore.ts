import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, registerUser } from "../api";
import { showErrorToast } from "../utils";

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
            const errorMsg = response.message || "Login failed";
            showErrorToast(new Error(errorMsg));

            // Logout on login error to clear any stale state
            localStorage.removeItem("token");
            set({
              error: errorMsg, // Still store error in state for potential programmatic use
              isLoading: false,
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (error: unknown) {
          const errorMsg = showErrorToast(error, "Login failed");

          // Logout on login error to clear any stale state
          localStorage.removeItem("token");
          set({
            error: errorMsg, // Still store error in state for potential programmatic use
            isLoading: false,
            user: null,
            isAuthenticated: false,
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
            const errorMsg = response.message || "Registration failed";
            showErrorToast(new Error(errorMsg));
            set({
              error: errorMsg, // Still store error in state for potential programmatic use
              isLoading: false,
            });
          }
        } catch (error: unknown) {
          const errorMsg = showErrorToast(error, "Registration failed");
          set({
            error: errorMsg, // Still store error in state for potential programmatic use
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
          error: null,
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
