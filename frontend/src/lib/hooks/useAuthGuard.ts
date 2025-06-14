import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

export const useAuthGuard = (redirectTo = "/login") => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return { isAuthenticated };
};

export const useUnauthGuard = (redirectTo = "/dashboard") => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return { isAuthenticated };
};
