"use client";

import { Loader2, MailCheck } from "lucide-react";
import { useState } from "react";

import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { RESEND_COOLDOWN_SECONDS, useCooldown, useResendVerification, type ResendTarget } from "@/hooks/use-email-verification";
import { ApiClientError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/**
 * "Resend Verification Email" with loading, success, error and cooldown states. The cooldown
 * mirrors the backend rate limit, which is what actually enforces it (429 + Retry-After).
 */
export function ResendVerificationButton({
  target,
  initialCooldown = 0,
  label = "Resend Verification Email",
  className,
}: {
  target: ResendTarget;
  /** Seconds to wait before the first resend, e.g. right after registration sent an email. */
  initialCooldown?: number;
  label?: string;
  className?: string;
}) {
  const resend = useResendVerification();
  const cooldown = useCooldown(initialCooldown);
  const [notice, setNotice] = useState<string | null>(null);

  function send() {
    setNotice(null);
    resend.mutate(target, {
      onSuccess: (message) => {
        setNotice(message ?? "A new verification link is on its way.");
        cooldown.start(RESEND_COOLDOWN_SECONDS);
      },
      onError: (error) => {
        if (error instanceof ApiClientError && error.status === 429) {
          cooldown.start(error.retryAfter ?? RESEND_COOLDOWN_SECONDS);
        }
      },
    });
  }

  const waiting = cooldown.remaining > 0;
  const rateLimited = resend.error instanceof ApiClientError && resend.error.status === 429;

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        onClick={send}
        disabled={resend.isPending || waiting}
        className="h-11 w-full rounded-full bg-cta text-sm font-bold text-white shadow-md hover:opacity-95"
      >
        {resend.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : waiting ? (
          `Resend available in ${cooldown.remaining}s`
        ) : (
          label
        )}
      </Button>
      {notice && !resend.isError ? (
        <p role="status" className="flex items-start gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <MailCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {notice}
        </p>
      ) : null}
      {rateLimited ? (
        <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          You&apos;ve requested several emails already. Please wait before trying again.
        </p>
      ) : (
        <InlineError error={resend.error} />
      )}
    </div>
  );
}
