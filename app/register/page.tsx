import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import { RegisterForm } from "@/components/storefront/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <Container className="py-8 lg:py-12">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </Container>
  );
}
