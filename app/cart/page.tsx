import { Container } from "@/components/layout/container";
import { CartPageClient } from "@/components/storefront/cart-page-client";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  return (
    <Container className="space-y-8 py-12 lg:py-16">
      <div className="space-y-4">
        <Badge>Cart</Badge>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Review your basket before checkout</h1>
          <p className="max-w-3xl text-base text-muted-foreground">
            The cart route is now interactive and uses the existing Zustand store to manage quantity changes, removals, and the running order summary.
          </p>
        </div>
      </div>
      <CartPageClient />
    </Container>
  );
}
