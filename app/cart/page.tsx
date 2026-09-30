import { Container } from "@/components/layout/container";
import { CartPageClient } from "@/components/storefront/cart-page-client";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  return (
    <Container className="space-y-8 py-12 lg:py-16">
      <div className="space-y-4">
        <Badge>Cart preview</Badge>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Review your basket before checkout</h1>
          <p className="max-w-3xl text-base text-muted-foreground">
            This local preview allows quantity changes and item removal. The cart is not synced to the server, and no order can be placed.
          </p>
        </div>
      </div>
      <CartPageClient />
    </Container>
  );
}
