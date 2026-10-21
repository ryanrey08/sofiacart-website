"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { useAuthSync } from "@/hooks/use-auth";
import { ApiClientError, isEmailUnverifiedError } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

function AuthSync() {
  useAuthSync();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client: QueryClient = new QueryClient({
      // The backend refused an action because the email is unverified: refresh the profile so the
      // verification prompts appear even if the stored profile was out of date.
      mutationCache: new MutationCache({
        onError: (error) => {
          if (isEmailUnverifiedError(error)) void client.invalidateQueries({ queryKey: queryKeys.me });
        },
      }),
      defaultOptions: {
        queries: {
          // Client errors (401/403/404/422) will not succeed on retry.
          retry: (count, error) =>
            !(error instanceof ApiClientError && error.status && error.status < 500) && count < 1,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
      },
    });

    return client;
  });

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
