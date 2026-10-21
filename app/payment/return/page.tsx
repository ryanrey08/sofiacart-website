import type { Metadata } from "next";
import { Suspense } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { PaymentReturnClient } from "@/components/checkout/payment-return-client";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Payment" };

export default function PaymentReturnPage() {
  return (
    <RequireAuth>
      <Container className="py-6">
        <Suspense>
          <PaymentReturnClient />
        </Suspense>
      </Container>
    </RequireAuth>
  );
}
