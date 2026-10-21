"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useSession } from "@/hooks/use-session";
import { queryKeys } from "@/lib/api/query-keys";
import { authService, type VerificationLink } from "@/lib/api/services/auth";

/** Matches the backend limit of one verification email per minute. */
export const RESEND_COOLDOWN_SECONDS = 60;

export type ResendTarget = { kind: "account" } | { kind: "link"; link: VerificationLink } | { kind: "email"; email: string };

/** Seconds left on a countdown; `start(seconds)` restarts it. */
export function useCooldown(initialSeconds = 0) {
  const [until, setUntil] = useState(() => (initialSeconds > 0 ? Date.now() + initialSeconds * 1000 : 0));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until === 0) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= until) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [until]);

  return {
    remaining: Math.max(0, Math.ceil((until - now) / 1000)),
    start: (seconds: number) => {
      const current = Date.now();
      setNow(current);
      setUntil(current + seconds * 1000);
    },
  };
}

export function useResendVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (target: ResendTarget) =>
      target.kind === "account"
        ? authService.resendVerification()
        : authService.resendVerificationPublic(target.kind === "link" ? target.link : { email: target.email }),
    // The backend may answer "already verified"; refresh the profile either way.
    onSuccess: (_message, target) => {
      if (target.kind === "account") void queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (link: VerificationLink) => authService.verifyEmail(link),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

/**
 * The signed-in customer's verification status as the backend reports it (`GET /auth/me`),
 * refetched whenever a verification screen mounts instead of trusting the stored profile.
 */
export function useVerificationStatus() {
  const { isAuthenticated, user } = useSession();
  const me = useQuery({
    queryKey: queryKeys.me,
    queryFn: authService.me,
    enabled: isAuthenticated,
    refetchOnMount: "always",
  });
  const current = me.data ?? user;

  return {
    user: current,
    verified: current?.emailVerified === true,
    checking: me.isFetching,
    error: me.error,
    recheck: () => me.refetch(),
  };
}
