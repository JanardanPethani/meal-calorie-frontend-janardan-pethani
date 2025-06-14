"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="border-b bg-background">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="text-xl font-bold">
          Calorie Counter
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={
                  pathname === "/dashboard" ? "text-primary font-medium" : ""
                }
              >
                Dashboard
              </Link>
              <Link
                href="/calories"
                className={
                  pathname === "/calories" ? "text-primary font-medium" : ""
                }
              >
                Calorie Lookup
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Hello, {user?.firstName}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={
                  pathname === "/login" ? "text-primary font-medium" : ""
                }
              >
                Login
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
