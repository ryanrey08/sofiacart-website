import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Container className="py-6">
        <CheckoutPageClient />
      </Container>
    </RequireAuth>
  );
}
