"use client";

import { MailWarning, RefreshCw } from "lucide-react";
import Link from "next/link";

import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
import { VerificationShell } from "@/components/auth/verification-shell";
import { Button } from "@/components/ui/button";
import { useVerificationStatus } from "@/hooks/use-email-verification";

/**
 * Shown in place of checkout while the customer's email is unverified. The backend refuses the
 * order anyway (403 `email_unverified`); this explains why and offers a resend.
 */
export function VerificationRequired({ email }: { email: string }) {
  const status = useVerificationStatus();

  return (
    <VerificationShell icon={MailWarning} tone="warning" title="Verify your email to place your order">
      <p className="text-xs text-slate-500">
        We sent a verification link to <span className="break-all font-semibold text-slate-700">{email}</span>. Open it to confirm your address — your cart is saved while you do.
      </p>
      <ResendVerificationButton target={{ kind: "account" }} />
      <Button type="button" variant="outline" className="w-full rounded-full text-xs font-bold" disabled={status.checking} onClick={() => void status.recheck()}>
        <RefreshCw className={status.checking ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
        {status.checking ? "Checking…" : "I've verified my email"}
      </Button>
      <p className="text-[11px] text-slate-500">
        <Link href="/cart" className="font-semibold text-brand hover:underline">Back to Cart</Link>
        {" · "}
        <Link href="/account/settings" className="font-semibold text-brand hover:underline">Change email address</Link>
      </p>
    </VerificationShell>
  );
}
