"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="text-xl font-bold">
          Calorie Counter
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
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

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-4 bg-background">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`py-2 ${
                    pathname === "/dashboard" ? "text-primary font-medium" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/calories"
                  className={`py-2 ${
                    pathname === "/calories" ? "text-primary font-medium" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  Calorie Lookup
                </Link>
                <div className="flex items-center justify-between py-2">
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
                  className={`py-2 ${
                    pathname === "/login" ? "text-primary font-medium" : ""
                  }`}
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link href="/register" className="py-2" onClick={toggleMenu}>
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
            <div className="py-2 flex justify-start">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
