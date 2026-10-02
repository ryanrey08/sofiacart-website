import type { Metadata } from "next";

import { ReturnsAndRefunds } from "@/components/orders/returns-refunds";

export const metadata: Metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return <ReturnsAndRefunds />;
}
