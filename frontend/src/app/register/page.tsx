"use client";

import { useUnauthGuard } from "@/lib/hooks/useAuthGuard";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  const { isAuthenticated } = useUnauthGuard();

  // If the user is already authenticated, they'll be redirected by the hook
  // This prevents the form from briefly showing before redirect
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
      <AuthForm type="register" />
    </div>
  );
}
