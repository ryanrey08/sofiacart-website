import type { Metadata } from "next";
import { Suspense } from "react";

import { MyOrders } from "@/components/orders/my-orders";
import { ListSkeleton } from "@/components/storefront/states";

export const metadata: Metadata = { title: "My Orders" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<ListSkeleton rows={4} />}>
      <MyOrders />
    </Suspense>
  );
}
