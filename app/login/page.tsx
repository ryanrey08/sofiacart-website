import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <Container className="max-w-5xl py-8 lg:py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
