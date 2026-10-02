"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiClientError } from "@/lib/api/client";
import { authService } from "@/lib/api/services/auth";

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-black text-ink">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const request = useMutation({ mutationFn: (value: string) => authService.forgotPassword(value) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    request.mutate(email.trim());
  }

  if (request.isSuccess) {
    return (
      <Shell title="Check your email" subtitle={request.data ?? "If an account exists for that email, a password reset link has been sent."}>
        <Button asChild variant="outline" className="w-full rounded-full"><Link href="/login">Back to Sign In</Link></Button>
      </Shell>
    );
  }

  return (
    <Shell title="Forgot your password?" subtitle="Enter your account email and we'll send you a link to reset it.">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-[11px] font-semibold text-slate-700">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 rounded-xl pl-9 text-xs" />
          </div>
        </div>
        <InlineError error={request.error} />
        <Button type="submit" disabled={request.isPending} className="h-11 w-full rounded-full bg-cta text-sm font-bold text-white">
          {request.isPending ? "Sending…" : "Send Reset Link"}
        </Button>
        <p className="text-center text-xs"><Link href="/login" className="font-semibold text-brand hover:underline">Back to Sign In</Link></p>
      </form>
    </Shell>
  );
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const reset = useMutation({ mutationFn: authService.resetPassword });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) return setClientError("Use at least 8 characters.");
    if (password !== confirmation) return setClientError("Passwords do not match.");
    setClientError(null);
    reset.mutate({ email: email.trim(), token, password, passwordConfirmation: confirmation });
  }

  if (!token) {
    return (
      <Shell title="Invalid reset link" subtitle="This password reset link is missing its token. Request a new link.">
        <Button asChild className="w-full rounded-full"><Link href="/forgot-password">Request a new link</Link></Button>
      </Shell>
    );
  }

  if (reset.isSuccess) {
    return (
      <Shell title="Password updated" subtitle={reset.data ?? "Your password has been reset. Please sign in."}>
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-500" />
        <Button asChild className="w-full rounded-full bg-brand"><Link href="/login">Sign In</Link></Button>
      </Shell>
    );
  }

  const apiError = reset.error instanceof ApiClientError ? reset.error : null;

  return (
    <Shell title="Set a new password" subtitle="Choose a new password for your SofiaCart account.">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-[11px] font-semibold text-slate-700">Email Address</Label>
          <Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 rounded-xl text-xs" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password" className="text-[11px] font-semibold text-slate-700">New Password</Label>
          <PasswordInput id="password" required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmation" className="text-[11px] font-semibold text-slate-700">Confirm New Password</Label>
          <PasswordInput id="confirmation" required autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        </div>
        {clientError ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{clientError}</p> : <InlineError error={apiError ?? reset.error} />}
        <Button type="submit" disabled={reset.isPending} className="h-11 w-full rounded-full bg-cta text-sm font-bold text-white">
          {reset.isPending ? "Saving…" : "Reset Password"}
        </Button>
      </form>
    </Shell>
  );
}
