"use client";

import { useEffect } from "react";
import { useUnauthGuard } from "@/lib/hooks/useAuthGuard";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthStore } from "@/lib/stores/authStore";

export default function LoginPage() {
  const { isAuthenticated } = useUnauthGuard();
  const { clearError } = useAuthStore();

  // Clear any existing errors when the page mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // If the user is already authenticated, they'll be redirected by the hook
  // This prevents the form from briefly showing before redirect
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full px-4 py-6 md:py-12">
      <h1 className="text-2xl font-bold text-center mb-4 md:mb-6">Login</h1>
      <AuthForm type="login" />
    </div>
  );
}
