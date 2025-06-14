import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Meal Calorie Counter",
  description:
    "Login to your Meal Calorie Counter account to track your meals and calories.",
  keywords: "login, account, authentication",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
