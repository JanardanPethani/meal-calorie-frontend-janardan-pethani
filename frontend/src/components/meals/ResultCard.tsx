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
    <Card className="w-full bg-primary/5 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Calorie Results</CardTitle>
        <CardDescription className="text-sm">
          Nutrition information for {currentMeal.dish_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                Dish Name
              </p>
              <p className="text-sm md:text-base font-medium">
                {currentMeal.dish_name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                Servings
              </p>
              <p className="text-sm md:text-base font-medium">
                {currentMeal.servings}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                Calories Per Serving
              </p>
              <p className="text-sm md:text-base font-medium">
                {currentMeal.calories_per_serving} kcal
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                Total Calories
              </p>
              <p className="text-sm md:text-base lg:text-lg font-medium text-primary">
                {currentMeal.total_calories} kcal
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground mt-auto border-t pt-3">
        Source: {currentMeal.source}
      </CardFooter>
    </Card>
  );
}
