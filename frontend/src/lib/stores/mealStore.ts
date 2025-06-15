import { create } from "zustand";
import {
  getCalories,
  getSearchHistory,
  clearSearchHistory,
  deleteSearchHistoryItem,
} from "@/lib/api";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export interface MealResult {
  _id?: string;
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
}

interface MealState {
  currentMeal: MealResult | null;
  mealHistory: MealResult[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  fetchCalories: (dishName: string, servings: number) => Promise<void>;
  fetchMealHistory: () => Promise<void>;
  clearMealHistory: () => Promise<void>;
  deleteMealHistoryItem: (id: string) => Promise<void>;
  clearCurrentMeal: () => void;
  clearError: () => void;
}

export const useMealStore = create<MealState>()((set, get) => ({
  currentMeal: null,
  mealHistory: [],
  isLoading: false,
  isLoadingHistory: false,
  error: null,

  fetchCalories: async (dishName, servings) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getCalories({ dish_name: dishName, servings });

      if (response.success) {
        const mealData: MealResult = {
          dish_name: response.dish_name,
          servings: response.servings,
          calories_per_serving: response.calories_per_serving,
          total_calories: response.total_calories,
          source: response.source,
        };

        set({
          currentMeal: mealData,
          isLoading: false,
        });

        // Refresh history after adding new item
        get().fetchMealHistory();

        showSuccessToast("Calorie data fetched successfully!");
      } else {
        const errorMsg = response.message || "Failed to fetch calorie data";
        showErrorToast(new Error(errorMsg));
        set({
          error: errorMsg, // Still store error in state for potential programmatic use
          isLoading: false,
        });
      }
    } catch (error: unknown) {
      const errorMsg = showErrorToast(error, "Failed to fetch calorie data");
      set({
        error: errorMsg, // Still store error in state for potential programmatic use
        isLoading: false,
      });
    }
  },

  fetchMealHistory: async () => {
    try {
      set({ isLoadingHistory: true });
      const response = await getSearchHistory(10); // Limit to 10 items

      if (response.success) {
        set({
          mealHistory: response.history,
          isLoadingHistory: false,
        });
      } else {
        const errorMsg = response.message || "Failed to fetch meal history";
        showErrorToast(new Error(errorMsg));
        set({
          isLoadingHistory: false,
          error: errorMsg, // Still store error in state for potential programmatic use
        });
      }
    } catch (error) {
      console.error("Failed to fetch meal history", error);
      showErrorToast(error, "Failed to fetch meal history");
      set({ isLoadingHistory: false });

      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch meal history";
        set({ error: errorMsg }); // Still store error in state for potential programmatic use
      }
    }
  },

  clearMealHistory: async () => {
    try {
      const response = await clearSearchHistory();
      if (response.success) {
        set({ mealHistory: [] });
        showSuccessToast("Meal history cleared successfully");
      } else {
        const errorMsg = response.message || "Failed to clear meal history";
        showErrorToast(new Error(errorMsg));
        set({ error: errorMsg }); // Still store error in state for potential programmatic use
      }
    } catch (error) {
      console.error("Failed to clear meal history", error);
      showErrorToast(error, "Failed to clear meal history");

      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to clear meal history";
        set({ error: errorMsg }); // Still store error in state for potential programmatic use
      }
    }
  },

  deleteMealHistoryItem: async (id: string) => {
    try {
      const response = await deleteSearchHistoryItem(id);

      if (response.success) {
        // Update the local state by removing the deleted item
        set((state) => ({
          mealHistory: state.mealHistory.filter((item) => item._id !== id),
        }));

        showSuccessToast("Item removed from history");
      } else {
        const errorMsg = response.message || "Failed to delete history item";
        showErrorToast(new Error(errorMsg));
        set({ error: errorMsg }); // Still store error in state for potential programmatic use
      }
    } catch (error) {
      console.error("Failed to delete history item", error);
      showErrorToast(error, "Failed to delete history item");

      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete history item";
        set({ error: errorMsg }); // Still store error in state for potential programmatic use
      }
    }
  },

  clearCurrentMeal: () => {
    set({ currentMeal: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
