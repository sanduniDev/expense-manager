"use client";

import type React from "react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: "/login" }); // Redirect to the login page after sign-out
  };
  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home,
    },
    {
      name: "Transactions",
      path: "/dashboard/transactions",
      icon: CreditCard,
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      name: "Budget",
      path: "/dashboard/budgets",
      icon: Wallet,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="grid gap-2 text-lg font-medium">
              <Button
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setOpen(false)}
              >
                <DollarSign className="h-6 w-6" />
                <span className="font-bold">Expense Manager</span>
              </Button>
              <div className="my-4 h-px bg-muted" />
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent",
                    pathname === route.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <route.icon className="h-5 w-5" />
                  {route.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <DollarSign className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block">
              Expense Manager
            </span>
          </Link>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Avatar>
            <AvatarImage src="" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent",
                  pathname === route.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-muted" />
            <Link
              href={"/"}
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
