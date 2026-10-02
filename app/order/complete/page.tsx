import type { Metadata } from "next";
import { Suspense } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { OrderCompleteClient } from "@/components/checkout/order-complete-client";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Order Complete" };

export default function OrderCompletePage() {
  return (
    <RequireAuth>
      <Container className="py-6">
        <Suspense>
          <OrderCompleteClient />
        </Suspense>
      </Container>
    </RequireAuth>
  );
}
