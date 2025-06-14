import * as z from "zod";

export const mealSchema = z.object({
  dish_name: z.string().min(1, { message: "Dish name is required" }),
  servings: z.coerce
    .number()
    .positive({ message: "Servings must be a positive number" })
    .min(0.1, { message: "Servings must be greater than 0" }),
});

export type MealFormValues = z.infer<typeof mealSchema>;
