import { create } from "zustand";
import { getCalories, getSearchHistory, clearSearchHistory } from "@/lib/api";

export interface MealResult {
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
      } else {
        set({ error: "Failed to fetch calorie data", isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch calorie data",
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
        set({ isLoadingHistory: false });
      }
    } catch (error) {
      console.error("Failed to fetch meal history", error);
      set({ isLoadingHistory: false });
    }
  },

  clearMealHistory: async () => {
    try {
      await clearSearchHistory();
      set({ mealHistory: [] });
    } catch (error) {
      console.error("Failed to clear meal history", error);
    }
  },

  clearCurrentMeal: () => {
    set({ currentMeal: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
