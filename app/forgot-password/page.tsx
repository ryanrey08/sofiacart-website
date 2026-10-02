import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <Container className="py-12">
      <ForgotPasswordForm />
    </Container>
  );
}
