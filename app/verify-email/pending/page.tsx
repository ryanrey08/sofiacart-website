import type { Metadata } from "next";
import { Suspense } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { VerifyEmailPending } from "@/components/auth/verify-email-pending";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Check Your Email" };

export default function VerifyEmailPendingPage() {
  return (
    <RequireAuth>
      <Container className="py-12">
        <Suspense>
          <VerifyEmailPending />
        </Suspense>
      </Container>
    </RequireAuth>
  );
}
