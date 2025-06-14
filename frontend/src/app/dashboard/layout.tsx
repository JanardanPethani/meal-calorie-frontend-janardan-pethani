import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Meal Calorie Counter",
  description: "View your meal history and calorie tracking statistics.",
  keywords: "dashboard, calories, meal history, nutrition tracking",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
