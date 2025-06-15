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
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

export function MealHistory() {
  const {
    mealHistory,
    isLoadingHistory,
    clearMealHistory,
    deleteMealHistoryItem,
  } = useMealStore();
  const [deletingItems, setDeletingItems] = useState<Record<string, boolean>>(
    {}
  );

  const handleDeleteItem = async (id: string) => {
    if (!id) return;

    setDeletingItems((prev) => ({ ...prev, [id]: true }));
    await deleteMealHistoryItem(id);
    setDeletingItems((prev) => ({ ...prev, [id]: false }));
  };

  if (isLoadingHistory) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (mealHistory.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Recent Meals</CardTitle>
        <CardDescription className="text-sm">
          Your recent calorie lookups
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {mealHistory.map((meal) => (
            <div
              key={meal._id}
              className="flex flex-col justify-between p-3 border rounded-lg hover:bg-accent/50 h-full"
            >
              <div>
                <p className="font-medium text-sm md:text-base">
                  {meal.dish_name}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {meal.servings} {meal.servings === 1 ? "serving" : "servings"}
                </p>
              </div>
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  {meal.calories_per_serving} kcal/serving
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm md:text-base font-medium text-primary">
                    {meal.total_calories} kcal
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteItem(meal._id || "")}
                    disabled={deletingItems[meal._id || ""]}
                  >
                    {deletingItems[meal._id || ""] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete item</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4 mt-2">
        <p className="text-xs md:text-sm text-muted-foreground">
          {mealHistory.length} {mealHistory.length === 1 ? "meal" : "meals"} in
          history
        </p>
        <Button variant="outline" size="sm" onClick={() => clearMealHistory()}>
          Clear History
        </Button>
      </CardFooter>
    </Card>
  );
}
