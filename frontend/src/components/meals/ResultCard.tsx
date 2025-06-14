"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMealStore } from "@/lib/stores/mealStore";

export function ResultCard() {
  const { currentMeal } = useMealStore();

  if (!currentMeal) {
    return null;
  }

  return (
    <Card className="w-full bg-primary/5">
      <CardHeader>
        <CardTitle className="text-xl">Calorie Results</CardTitle>
        <CardDescription>
          Nutrition information for {currentMeal.dish_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dish Name</p>
              <p className="font-medium">{currentMeal.dish_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Servings</p>
              <p className="font-medium">{currentMeal.servings}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Calories Per Serving
              </p>
              <p className="font-medium">
                {currentMeal.calories_per_serving} kcal
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Calories</p>
              <p className="font-medium text-lg text-primary">
                {currentMeal.total_calories} kcal
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Source: {currentMeal.source}
      </CardFooter>
    </Card>
  );
}
