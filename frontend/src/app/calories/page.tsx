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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Calorie Lookup</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <MealForm />
        </div>

        <div>
          {currentMeal ? (
            <ResultCard />
          ) : (
            <div className="h-full flex items-center justify-center p-8 border rounded-lg bg-muted/20">
              <p className="text-center text-muted-foreground">
                Enter a dish name and servings to see calorie information
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <MealHistory />
      </div>
    </div>
  );
}
