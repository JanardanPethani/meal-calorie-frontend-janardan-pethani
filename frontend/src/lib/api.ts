import axios from "axios";
import { showErrorToast } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors globally
    if (!error.response) {
      // Network error or server not responding
      showErrorToast(error, "Network error. Please check your connection.");
    } else if (error.response.status === 401) {
      // Handle unauthorized errors (expired token, etc.)
      if (typeof window !== "undefined") {
        // Clear token for all 401 errors
        localStorage.removeItem("token");

        // Only show the session expired message if not on login page
        if (window.location.pathname !== "/login") {
          showErrorToast(
            error,
            "Your session has expired. Please login again."
          );
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        }
      }
    } else if (error.response.status === 403) {
      // Forbidden errors
      showErrorToast(
        error,
        "You don't have permission to perform this action."
      );

      // If on a protected route, redirect to login
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else if (error.response.status >= 500) {
      // Server errors
      showErrorToast(error, "Server error. Please try again later.");
    }

    console.warn(
      "API Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    // Clear any existing auth data on registration failure
    localStorage.removeItem("token");
    throw error;
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    // Clear any existing auth data on login failure
    localStorage.removeItem("token");
    throw error;
  }
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Calorie APIs
export const getCalories = async (data: {
  dish_name: string;
  servings: number;
}) => {
  const response = await api.post("/get-calories", data);
  return response.data;
};

// Search History APIs
export const getSearchHistory = async (limit?: number) => {
  const params = limit ? { limit } : {};
  const response = await api.get("/search-history", { params });
  return response.data;
};

export const clearSearchHistory = async () => {
  const response = await api.delete("/search-history");
  return response.data;
};

export const deleteSearchHistoryItem = async (id: string) => {
  const response = await api.delete(`/search-history/${id}`);
  return response.data;
};

export default api;
