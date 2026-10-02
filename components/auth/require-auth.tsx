"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";

export function loginHref(redirectTo: string) {
  return `/login?redirect=${encodeURIComponent(redirectTo)}`;
}

/**
 * Client-side guard for customer pages (the token lives in browser storage). The backend still
 * authorizes every request; this only sends signed-out visitors to the login page.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { hydrated, isAuthenticated } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const query = typeof window !== "undefined" ? window.location.search : "";
      router.replace(loginHref(pathname + query));
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <Container className="space-y-4 py-10" aria-busy>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </Container>
    );
  }

  return <>{children}</>;
}
