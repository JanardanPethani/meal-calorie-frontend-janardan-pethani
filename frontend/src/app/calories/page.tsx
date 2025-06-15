"use client";

import { useEffect } from "react";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { MealForm } from "@/components/meals/MealForm";
import { ResultCard } from "@/components/meals/ResultCard";
import { MealHistory } from "@/components/meals/MealHistory";
import { useMealStore } from "@/lib/stores/mealStore";

export default function CaloriesPage() {
  const { isAuthenticated } = useAuthGuard();
  const { currentMeal, fetchMealHistory } = useMealStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMealHistory();
    }
  }, [isAuthenticated, fetchMealHistory]);

  // If not authenticated, the hook will redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Calorie Lookup
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="h-full">
          <MealForm />
        </div>

        <div className="h-full">
          {currentMeal ? (
            <ResultCard />
          ) : (
            <div className="flex items-center justify-center p-4 md:p-8 border rounded-lg bg-muted/20 min-h-[120px] md:h-full">
              <p className="text-center text-sm md:text-base text-muted-foreground">
                Enter a dish name and servings to see calorie information
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 md:mt-12">
        <MealHistory />
      </div>
    </div>
  );
}
