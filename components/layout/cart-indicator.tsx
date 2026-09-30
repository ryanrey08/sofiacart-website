"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export function CartIndicator() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button variant="outline" size="icon" asChild className="relative" aria-label="Shopping cart">
      <Link href="/cart">
        <ShoppingCart className="size-4" />
        <Badge className="absolute -right-2 -top-2 size-5 justify-center rounded-full px-0 py-0 text-[10px]">
          {itemCount}
        </Badge>
      </Link>
    </Button>
  );
}
