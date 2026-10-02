import type { Metadata } from "next";

import { PaymentHistory } from "@/components/account/payment-history";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return <PaymentHistory />;
}
