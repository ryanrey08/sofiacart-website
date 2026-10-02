import type { Metadata } from "next";

import { ReturnRequestForm } from "@/components/orders/return-request-form";

export const metadata: Metadata = { title: "Request a Return" };

export default async function ReturnRequestPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <ReturnRequestForm orderNumber={decodeURIComponent(orderNumber)} />;
}
