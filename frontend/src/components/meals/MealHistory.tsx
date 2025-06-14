"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMealStore } from "@/lib/stores/mealStore";
import { Loader2 } from "lucide-react";

export function MealHistory() {
  const { mealHistory, isLoadingHistory, clearMealHistory } = useMealStore();

  if (isLoadingHistory) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (mealHistory.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Meals</CardTitle>
        <CardDescription>Your recent calorie lookups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mealHistory.map((meal, index) => (
            <div
              key={`${meal.dish_name}-${index}`}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
            >
              <div>
                <p className="font-medium">{meal.dish_name}</p>
                <p className="text-sm text-muted-foreground">
                  {meal.servings} {meal.servings === 1 ? "serving" : "servings"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{meal.total_calories} kcal</p>
                <p className="text-xs text-muted-foreground">
                  {meal.calories_per_serving} kcal/serving
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => clearMealHistory()}>
          Clear History
        </Button>
      </CardFooter>
    </Card>
  );
}
