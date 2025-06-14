import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calorie Lookup | Meal Calorie Counter",
  description:
    "Calculate the calories in your meals using our powerful lookup tool powered by the USDA Food Database.",
  keywords: "calories, meal, nutrition, food, diet, health",
};

export default function CaloriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
