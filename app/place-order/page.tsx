import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { PlaceOrderClient } from "@/components/checkout/place-order-client";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Review Your Order" };

export default function PlaceOrderPage() {
  return (
    <RequireAuth>
      <Container className="py-6">
        <PlaceOrderClient />
      </Container>
    </RequireAuth>
  );
}
