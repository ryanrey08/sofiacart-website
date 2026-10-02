"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/hooks/use-cart";

export function CartIndicator() {
  const { count } = useCart();

  return (
    <Link href="/cart" className="relative flex flex-col items-center gap-0.5 text-xs font-medium hover:text-brand" aria-label={`Cart, ${count} items`}>
      <ShoppingCart className="h-5 w-5" />
      <span className="hidden sm:block">Cart</span>
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-pink px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
