"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { useMealStore } from "@/lib/stores/mealStore";
import { mealSchema, MealFormValues } from "@/lib/validations/meal";

export function MealForm() {
  const { fetchCalories, isLoading } = useMealStore();

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

      // If successful, reset the form
      if (!useMealStore.getState().error) {
        form.reset();
      }
    } catch (error) {
      console.error("Error fetching calories:", error);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Meal Calorie Lookup</CardTitle>
        <CardDescription className="text-sm">
          Enter a dish name and number of servings to get calorie information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6 h-full flex flex-col"
          >
            <div className="space-y-4 flex-grow">
              <FormField
                control={form.control}
                name="dish_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Dish Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., chicken biryani" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Number of Servings
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-auto pt-4 md:pt-0">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? "Calculating..." : "Calculate Calories"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
