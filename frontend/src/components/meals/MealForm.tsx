"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useMealStore } from "@/lib/stores/mealStore";
import { mealSchema, MealFormValues } from "@/lib/validations/meal";

export function MealForm() {
  const { fetchCalories, error, isLoading } = useMealStore();

  // Initialize form
  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      dish_name: "",
      servings: 1,
    },
  });

  const onSubmit = async (values: MealFormValues) => {
    try {
      await fetchCalories(values.dish_name, values.servings);

      // Check if there's an error after the fetch attempt
      if (!useMealStore.getState().error) {
        toast.success("Calorie data fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching calories:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Meal Calorie Lookup</CardTitle>
        <CardDescription>
          Enter a dish name and number of servings to get calorie information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dish_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dish Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., chicken biryani" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Servings</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Calculating..." : "Calculate Calories"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
