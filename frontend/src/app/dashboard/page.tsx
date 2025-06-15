"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useAuthStore } from "@/lib/stores/authStore";
import { useMealStore } from "@/lib/stores/mealStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MealHistory } from "@/components/meals/MealHistory";
import { BarChart3, Utensils } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated } = useAuthGuard();
  const { user } = useAuthStore();
  const { mealHistory, fetchMealHistory } = useMealStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMealHistory();
    }
  }, [isAuthenticated, fetchMealHistory]);

  // If not authenticated, the hook will redirect
  if (!isAuthenticated) {
    return null;
  }

  // Calculate some basic stats if there are meals
  const totalCalories = mealHistory.reduce(
    (sum, meal) => sum + meal.total_calories,
    0
  );
  const avgCaloriesPerMeal =
    mealHistory.length > 0 ? Math.round(totalCalories / mealHistory.length) : 0;

  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              Welcome, {user?.firstName}!
            </CardTitle>
            <CardDescription className="text-sm">
              Track your meals and monitor your calorie intake
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base mb-4">
              Use our calorie lookup tool to quickly find the calorie content of
              any dish and keep track of your nutrition.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/calories" className="w-full md:w-auto">
              <Button size="sm" className="w-full">
                Calculate Calories
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Your Stats
            </CardTitle>
            <CardDescription className="text-sm">
              Your meal tracking statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <span className="text-sm text-muted-foreground">
                  Meals Tracked
                </span>
                <span className="font-medium text-lg">
                  {mealHistory.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                <span className="text-sm text-muted-foreground">
                  Total Calories
                </span>
                <span className="font-medium text-lg">
                  {totalCalories} kcal
                </span>
              </div>
              {mealHistory.length > 0 && (
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                  <span className="text-sm text-muted-foreground">
                    Avg. per Meal
                  </span>
                  <span className="font-medium text-lg">
                    {avgCaloriesPerMeal} kcal
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <MealHistory />
      </div>

      {mealHistory.length === 0 && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-6 md:py-8 text-center">
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              You haven&apos;t tracked any meals yet. Start by calculating
              calories for a dish.
            </p>
            <Link href="/calories">
              <Button size="sm" className="w-full md:w-auto">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
