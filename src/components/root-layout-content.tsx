"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { ThemeProvider } from "@/components/theme-provider";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppLayout>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AppLayout>
      </ThemeProvider>
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
