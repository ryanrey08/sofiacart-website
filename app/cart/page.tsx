import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CartPageClient } from "@/components/storefront/cart-page-client";

export const metadata: Metadata = { title: "Shopping Cart" };

export default function CartPage() {
  return (
    <Container className="py-6 lg:py-8">
      <CartPageClient />
    </Container>
  );
}
