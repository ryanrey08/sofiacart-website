"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sampleCart } from "@/lib/mocks/storefront";
import { formatCurrency } from "@/lib/utils/format";
import { useCartStore } from "@/stores/cart-store";

export function CartPageClient() {
  const items = useCartStore((state) => state.items);
  const currency = useCartStore((state) => state.currency);
  const replaceItems = useCartStore((state) => state.replaceItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    if (items.length === 0) {
      replaceItems({ currency: sampleCart.currency, items: sampleCart.items });
    }
  }, [items.length, replaceItems]);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = items.length > 0 ? sampleCart.shipping : 0;
  const tax = items.length > 0 ? subtotal * 0.08 : 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
      <Card>
        <CardHeader>
          <CardTitle>Your cart</CardTitle>
          <CardDescription>Review items, adjust quantities, and continue when your basket looks right.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="rounded-xl border border-border p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{item.slug.replaceAll("-", " ")}</p>
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Freshly prepared for same-day packing.</p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(item.unitPrice * item.quantity, item.currency)}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-border p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" className="text-muted-foreground" onClick={() => removeItem(item.productId)}>
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(shipping, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated tax</span>
              <span>{formatCurrency(tax, currency)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total, currency)}</span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardContent className="flex items-start gap-3 p-5 text-sm text-muted-foreground">
            <ShoppingBag className="mt-0.5 size-4 text-primary" />
            <p>Spend ₱1,500 or more to unlock free standard delivery in the next integration phase.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
