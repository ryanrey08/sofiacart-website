import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/password-reset-forms";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Reset Password" };

/** Target of the reset link emailed by the backend: FRONTEND_URL/reset-password?token=&email= */
export default function ResetPasswordPage() {
  return (
    <Container className="py-12">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </Container>
  );
}
