"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { useAuthSync } from "@/hooks/use-auth";
import { ApiClientError } from "@/lib/api/client";

function AuthSync() {
  useAuthSync();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Client errors (401/403/404/422) will not succeed on retry.
            retry: (count, error) =>
              !(error instanceof ApiClientError && error.status && error.status < 500) && count < 1,
            refetchOnWindowFocus: false,
            staleTime: 30 * 1000,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthSync />
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
