"use client";

import { MailWarning } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/container";
import { useSession } from "@/hooks/use-session";

/** Reminder for signed-in customers whose email is not verified yet. */
export function EmailVerificationBanner() {
  const { user } = useSession();
  const pathname = usePathname();

  if (!user || user.emailVerified !== false || pathname.startsWith("/verify-email")) return null;

  return (
    <div className="border-b border-amber-100 bg-amber-50">
      <Container className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-xs text-amber-800">
        <MailWarning className="h-4 w-4 shrink-0" />
        <p className="min-w-0 flex-1">
          Verify your email address to place orders. We sent a link to <span className="break-all font-semibold">{user.email}</span>.
        </p>
        <Link href={`/verify-email/pending?redirect=${encodeURIComponent(pathname)}`} className="font-bold text-amber-900 underline-offset-2 hover:underline">
          Resend or check status
        </Link>
      </Container>
    </div>
  );
}
