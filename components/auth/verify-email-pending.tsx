"use client";

import { BadgeCheck, MailWarning, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
import { VerificationShell } from "@/components/auth/verification-shell";
import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RESEND_COOLDOWN_SECONDS, useVerificationStatus } from "@/hooks/use-email-verification";
import { safeRedirect } from "@/lib/utils/redirect";

/**
 * "Check your inbox" screen shown after registration, after an unverified sign-in, and from the
 * verification banner. Its status comes from `GET /auth/me`, never from local state.
 */
export function VerifyEmailPending() {
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"), "/");
  const sent = searchParams.get("sent");
  const status = useVerificationStatus();
  const [stillPending, setStillPending] = useState(false);

  if (!status.user) {
    return (
      <div className="mx-auto max-w-md space-y-4" aria-busy>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (status.verified) {
    return (
      <VerificationShell icon={BadgeCheck} tone="success" title="Your email is verified">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{status.user.email}</span> is confirmed. You can now place orders and receive order updates.
        </p>
        <Button asChild className="h-11 w-full rounded-full bg-brand text-sm font-bold">
          <Link href={redirectTo}>Continue</Link>
        </Button>
      </VerificationShell>
    );
  }

  async function recheck() {
    setStillPending(false);
    const result = await status.recheck();
    setStillPending(result.data?.emailVerified !== true && !result.error);
  }

  return (
    <VerificationShell icon={MailWarning} title="Verify your email address">
      <div className="space-y-2 text-xs text-slate-500">
        <p>
          {sent === "0" ? "We need to send a verification link to" : "We sent a verification link to"}
          <br />
          <span className="break-all text-sm font-bold text-ink">{status.user.email}</span>
        </p>
        <p>Open the link in that email to confirm your address. You can keep browsing and filling your cart, but you&apos;ll need a verified email to place orders.</p>
      </div>

      {sent === "0" ? (
        <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          We couldn&apos;t send the verification email just now. Use the button below to request it again.
        </p>
      ) : null}

      <ResendVerificationButton target={{ kind: "account" }} initialCooldown={sent === "1" ? RESEND_COOLDOWN_SECONDS : 0} />

      <div className="space-y-2">
        <Button type="button" variant="outline" className="w-full rounded-full text-xs font-bold" disabled={status.checking} onClick={() => void recheck()}>
          <RefreshCw className={status.checking ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          {status.checking ? "Checking…" : "I've verified my email"}
        </Button>
        {stillPending ? (
          <p role="status" className="text-[11px] text-slate-500">Your email isn&apos;t verified yet. Open the newest link we sent, then try again.</p>
        ) : null}
        <InlineError error={status.error} />
      </div>

      <div className="space-y-1 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
        <p>Can&apos;t find it? Check your spam or promotions folder. Links expire for your security; request a new one any time.</p>
        <p>
          Wrong address?{" "}
          <Link href="/account/settings" className="font-semibold text-brand hover:underline">Update your email</Link>
          {" · "}
          <Link href={redirectTo} className="font-semibold text-brand hover:underline">Continue shopping</Link>
        </p>
      </div>
    </VerificationShell>
  );
}
