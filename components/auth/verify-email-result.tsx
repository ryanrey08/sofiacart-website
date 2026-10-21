"use client";

import { BadgeCheck, Clock, Loader2, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
import { VerificationShell } from "@/components/auth/verification-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyEmail } from "@/hooks/use-email-verification";
import { useSession } from "@/hooks/use-session";
import { ApiClientError, errorMessage } from "@/lib/api/client";
import type { VerificationLink } from "@/lib/api/services/auth";

const linkPatterns: Record<keyof VerificationLink, RegExp> = {
  id: /^\d+$/,
  hash: /^[a-f0-9]{40}$/,
  expires: /^\d+$/,
  signature: /^[a-f0-9]{64}$/,
};

function readLink(params: URLSearchParams): VerificationLink | null {
  const link = {
    id: params.get("id") ?? "",
    hash: params.get("hash") ?? "",
    expires: params.get("expires") ?? "",
    signature: params.get("signature") ?? "",
  };

  return (Object.keys(linkPatterns) as (keyof VerificationLink)[]).every((key) => linkPatterns[key].test(link[key])) ? link : null;
}

function ContinueActions() {
  const { isAuthenticated } = useSession();

  return isAuthenticated ? (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button asChild className="h-11 rounded-full bg-brand text-sm font-bold"><Link href="/">Continue Shopping</Link></Button>
      <Button asChild variant="outline" className="h-11 rounded-full text-sm font-bold"><Link href="/cart">Go to Cart</Link></Button>
    </div>
  ) : (
    <Button asChild className="h-11 w-full rounded-full bg-brand text-sm font-bold"><Link href="/login">Sign In</Link></Button>
  );
}

/** Signed-out fallback: request a new link by email (the reply never says whether an account exists). */
function ResendByEmail() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(email.trim());
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <div className="space-y-1">
        <Label htmlFor="resend-email" className="text-[11px] font-semibold text-slate-700">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="resend-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSubmitted(null);
            }}
            className="h-10 rounded-xl pl-9 text-xs"
          />
        </div>
      </div>
      {submitted ? (
        <ResendVerificationButton key={submitted} target={{ kind: "email", email: submitted }} label="Send New Link" />
      ) : (
        <Button type="submit" className="h-11 w-full rounded-full bg-cta text-sm font-bold text-white">Continue</Button>
      )}
    </form>
  );
}

/**
 * Target of the emailed link: FRONTEND_URL/verify-email?id=&hash=&expires=&signature=. The backend
 * validates the signature, expiry and account; this page only shows its answer.
 */
export function VerifyEmailResult() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const link = useMemo(() => readLink(new URLSearchParams(query)), [query]);
  const { isAuthenticated } = useSession();
  const verify = useVerifyEmail();
  const { mutate } = verify;
  const requested = useRef<string | null>(null);

  useEffect(() => {
    // Once per link, also under React Strict Mode's double effects.
    if (link && requested.current !== query) {
      requested.current = query;
      mutate(link);
    }
  }, [link, mutate, query]);

  if (!link || (verify.error instanceof ApiClientError && verify.error.code === "verification_link_invalid")) {
    return (
      <VerificationShell icon={ShieldAlert} tone="danger" title="This link isn't valid">
        <p className="text-xs text-slate-500">
          The verification link is incomplete or no longer matches your account — for example because it was copied incorrectly or your email address changed. Request a new link below.
        </p>
        {isAuthenticated ? <ResendVerificationButton target={{ kind: "account" }} label="Send a New Link" /> : <ResendByEmail />}
      </VerificationShell>
    );
  }

  if (verify.error instanceof ApiClientError && verify.error.code === "verification_link_expired") {
    return (
      <VerificationShell icon={Clock} tone="warning" title="This link has expired">
        <p className="text-xs text-slate-500">
          For your security, verification links only work for a limited time. We can send a fresh link to the email address on your account.
        </p>
        <ResendVerificationButton target={isAuthenticated ? { kind: "account" } : { kind: "link", link }} label="Send a New Link" />
      </VerificationShell>
    );
  }

  if (verify.isError) {
    return (
      <VerificationShell icon={ShieldAlert} tone="danger" title="We couldn't verify your email">
        <p className="text-xs text-slate-500">{errorMessage(verify.error)}</p>
        <Button type="button" className="h-11 w-full rounded-full bg-brand text-sm font-bold" onClick={() => mutate(link)}>
          Try Again
        </Button>
      </VerificationShell>
    );
  }

  if (verify.isSuccess) {
    const alreadyVerified = verify.data.status === "already_verified";

    return (
      <VerificationShell icon={BadgeCheck} tone="success" title={alreadyVerified ? "Email already verified" : "Your email is verified!"}>
        <p className="text-xs text-slate-500">
          {alreadyVerified
            ? "This link has already been used and your email address is confirmed. There's nothing else you need to do."
            : "Thanks for confirming your email address. You can now place orders and receive order updates from SofiaCart."}
        </p>
        <ContinueActions />
      </VerificationShell>
    );
  }

  return (
    <VerificationShell icon={Loader2} title="Verifying your email…" className="[&_svg]:animate-spin">
      <p className="text-xs text-slate-500">This only takes a moment.</p>
    </VerificationShell>
  );
}
