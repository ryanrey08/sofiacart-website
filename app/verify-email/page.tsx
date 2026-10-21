import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailResult } from "@/components/auth/verify-email-result";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Verify Email" };

/** Target of the verification link emailed by the backend: FRONTEND_URL/verify-email?id=&hash=&expires=&signature= */
export default function VerifyEmailPage() {
  return (
    <Container className="py-12">
      <Suspense>
        <VerifyEmailResult />
      </Suspense>
    </Container>
  );
}
