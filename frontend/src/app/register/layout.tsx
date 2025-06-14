import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Meal Calorie Counter",
  description:
    "Create a new account to start tracking your meals and calories.",
  keywords: "register, signup, account, authentication",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
