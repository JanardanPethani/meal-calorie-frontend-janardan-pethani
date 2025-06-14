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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.firstName}!</CardTitle>
            <CardDescription>
              Track your meals and monitor your calorie intake
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Use our calorie lookup tool to quickly find the calorie content of
              any dish.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/calories">
              <Button>Calculate Calories</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>Your meal tracking statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Meals Tracked</span>
                <span className="font-medium">{mealHistory.length}</span>
              </div>
              {mealHistory.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Meal</span>
                  <span className="font-medium">
                    {mealHistory[0].dish_name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <MealHistory />

      {mealHistory.length === 0 && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t tracked any meals yet. Start by calculating
              calories for a dish.
            </p>
            <Link href="/calories">
              <Button>Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
