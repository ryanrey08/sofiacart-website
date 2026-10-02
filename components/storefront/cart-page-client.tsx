"use client";

import { AlertTriangle, ArrowLeft, Lock, LogIn, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginHref } from "@/components/auth/require-auth";
import { CheckoutStepper } from "@/components/storefront/checkout-stepper";
import { PopularProducts } from "@/components/storefront/home-sections";
import { ProductImage } from "@/components/storefront/product-image";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { EmptyState, ErrorState, InlineError, ListSkeleton } from "@/components/storefront/states";
import { AcceptedPayments, TrustBadges } from "@/components/storefront/trust-badges";
import { VoucherInput } from "@/components/storefront/voucher-input";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/use-cart";
import { useCheckoutSummary } from "@/hooks/use-checkout";
import { errorMessage } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/format";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { toast } from "@/stores/toast-store";
import type { Cart } from "@/types/domain";

const tableHeader = (
  <div className="hidden grid-cols-12 items-center border-b border-slate-100 pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:grid">
    <div className="col-span-5">Product</div>
    <div className="col-span-2 text-center">Price</div>
    <div className="col-span-2 text-center">Quantity</div>
    <div className="col-span-2 text-right">Total</div>
    <div className="col-span-1 text-right">Action</div>
  </div>
);

function PageHeader({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-ink">Shopping Cart</h1>
          <p className="text-xs text-slate-500">
            {count} item{count === 1 ? "" : "s"} in your cart
          </p>
        </div>
      </div>
      <CheckoutStepper current="Cart" />
    </div>
  );
}

export function CartPageClient() {
  const { hydrated, isAuthenticated, cart, guestItems, isLoading, error, refetch } = useCart();

  if (!hydrated || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8"><ListSkeleton rows={3} /></div>
          <Skeleton className="h-72 rounded-2xl lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (isAuthenticated && error) {
    return <ErrorState error={error} onRetry={() => void refetch()} title="Your cart couldn't be loaded" />;
  }

  const itemCount = isAuthenticated ? (cart?.itemCount ?? 0) : guestItems.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = isAuthenticated ? !cart?.items.length : guestItems.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader count={itemCount} />
      {isEmpty ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse products and add your favorites to the cart."
          action={
            <Button asChild className="rounded-full bg-brand">
              <Link href="/products">Start Shopping</Link>
            </Button>
          }
        />
      ) : isAuthenticated && cart ? (
        <ServerCart cart={cart} />
      ) : (
        <GuestCart />
      )}
      <PopularProducts title="You May Also Like" limit={6} />
    </div>
  );
}

function ServerCart({ cart }: { cart: Cart }) {
  const router = useRouter();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const voucherCode = useCheckoutStore((state) => state.voucherCode);
  const setVoucherCode = useCheckoutStore((state) => state.setVoucherCode);
  const setCartItemIds = useCheckoutStore((state) => state.setCartItemIds);

  // null = every available line (the default); otherwise the ids the shopper picked.
  const [picked, setPicked] = useState<Set<number> | null>(null);
  const availableIds = cart.items.filter((item) => item.available).map((item) => item.id);
  const selectedIds = availableIds.filter((id) => (picked ? picked.has(id) : true));
  const allSelected = selectedIds.length === availableIds.length && availableIds.length > 0;

  const summary = useCheckoutSummary({ cartItemIds: selectedIds, voucherCode }, selectedIds.length > 0);
  const totals = selectedIds.length > 0 ? summary.data : undefined;

  function toggle(id: number) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  }

  function mutateItem(action: Promise<unknown>, failure: string) {
    action.catch((mutationError) => toast.error(failure, errorMessage(mutationError)));
  }

  function proceed() {
    setCartItemIds(allSelected ? null : selectedIds);
    router.push("/checkout");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <Card className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-1 flex items-center gap-3 pb-3">
            <Checkbox
              id="select-all"
              checked={allSelected}
              disabled={availableIds.length === 0}
              onCheckedChange={() => setPicked(allSelected ? new Set() : null)}
            />
            <label htmlFor="select-all" className="cursor-pointer text-xs font-semibold text-slate-700">
              Select All ({availableIds.length} item{availableIds.length === 1 ? "" : "s"})
            </label>
          </div>
          {tableHeader}
          <ul className="divide-y divide-slate-100">
            {cart.items.map((item) => (
              <li key={item.id} className="grid grid-cols-12 items-center gap-2 py-4 sm:gap-0">
                <div className="col-span-12 flex items-center gap-3 sm:col-span-5">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    disabled={!item.available}
                    onCheckedChange={() => toggle(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                  <ProductImage src={item.imageUrl} alt={item.name ?? "Product"} className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 p-1" />
                  <div className="min-w-0 space-y-0.5 pr-2">
                    {item.slug ? (
                      <Link href={`/products/${item.slug}`} className="line-clamp-1 text-xs font-bold text-ink hover:text-brand sm:text-sm">
                        {item.name}
                      </Link>
                    ) : (
                      <p className="line-clamp-1 text-xs font-bold text-ink sm:text-sm">{item.name ?? "Unavailable product"}</p>
                    )}
                    {item.store ? <p className="text-[10px] text-slate-400">Store: <span className="text-slate-600">{item.store.name}</span></p> : null}
                    {item.variant?.label ? <p className="text-[10px] text-slate-400">Option: <span className="text-slate-600">{item.variant.label}</span></p> : null}
                    {item.available ? (
                      <span className="mt-1 inline-block rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">In Stock</span>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                        <AlertTriangle className="h-3 w-3" /> {item.issue ?? "Unavailable"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-4 text-left text-xs font-bold text-ink sm:col-span-2 sm:text-center">
                  {formatCurrency(item.unitPrice, item.currency)}
                </div>
                <div className="col-span-4 flex justify-center sm:col-span-2">
                  <QuantityStepper
                    value={item.quantity}
                    max={Math.max(item.quantity, item.availableQuantity)}
                    disabled={updateItem.isPending}
                    onChange={(quantity) => mutateItem(updateItem.mutateAsync({ itemId: item.id, quantity }), "Quantity not updated")}
                  />
                </div>
                <div className="col-span-4 text-right text-xs font-black text-ink sm:col-span-2">
                  {formatCurrency(item.lineTotal, item.currency)}
                </div>
                <div className="col-span-12 flex items-center justify-end gap-3 sm:col-span-1">
                  <WishlistButton productId={item.productId} />
                  <button
                    type="button"
                    onClick={() => mutateItem(removeItem.mutateAsync(item.id), "Item not removed")}
                    disabled={removeItem.isPending}
                    className="text-slate-400 transition-colors hover:text-red-500 disabled:opacity-40"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex items-center justify-between">
          <Button asChild variant="outline" className="rounded-full border-slate-200 text-xs font-bold text-brand">
            <Link href="/products">
              <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
            </Link>
          </Button>
          <Button
            variant="ghost"
            disabled={clearCart.isPending}
            onClick={() => {
              if (window.confirm("Remove every item from your cart?")) {
                mutateItem(clearCart.mutateAsync(), "Cart not cleared");
              }
            }}
            className="text-xs font-semibold text-slate-400 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear Cart
          </Button>
        </div>
      </div>

      <div className="space-y-4 lg:col-span-4">
        <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-ink">Order Summary</h2>
          {selectedIds.length === 0 ? (
            <p className="text-xs text-slate-500">Select the items you want to check out.</p>
          ) : summary.isPending ? (
            <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-8 w-full" /></div>
          ) : summary.isError ? (
            <InlineError error={summary.error} />
          ) : totals ? (
            <>
              <div className={`space-y-2.5 text-xs text-slate-600 ${summary.isFetching ? "opacity-60" : ""}`}>
                <div className="flex justify-between">
                  <span>Subtotal ({totals.orders.reduce((sum, group) => sum + group.items.reduce((count, line) => count + line.quantity, 0), 0)} items)</span>
                  <span className="font-bold text-ink">{formatCurrency(totals.subtotal, totals.currency)}</span>
                </div>
                {totals.discount > 0 ? (
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Discount{totals.voucher ? ` (${totals.voucher.code})` : ""}</span>
                    <span>-{formatCurrency(totals.discount, totals.currency)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-slate-400">Calculated at checkout</span>
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-ink">Total</span>
                <div className="text-right">
                  <span className="text-xl font-black text-ink">{formatCurrency(totals.total, totals.currency)}</span>
                  <p className="text-[9px] text-slate-400">Inclusive of VAT (if applicable)</p>
                </div>
              </div>
            </>
          ) : null}

          <Button
            onClick={proceed}
            disabled={selectedIds.length === 0 || summary.isError || summary.isPending}
            className="h-11 w-full rounded-full bg-cta text-xs font-bold text-white shadow-md hover:opacity-95"
          >
            <Lock className="h-4 w-4" /> Proceed to Checkout →
          </Button>

          <VoucherInput
            appliedCode={voucherCode}
            cartItemIds={selectedIds}
            onApply={(code) => {
              setVoucherCode(code);
              toast.success("Promo code applied", code);
            }}
            onRemove={() => setVoucherCode(null)}
          />
        </Card>
        <TrustBadges />
        <AcceptedPayments />
      </div>
    </div>
  );
}

function GuestCart() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <Card className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          {tableHeader}
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variantId ?? "base"}`} className="grid grid-cols-12 items-center gap-2 py-4 sm:gap-0">
                <div className="col-span-12 flex items-center gap-3 sm:col-span-5">
                  <ProductImage src={item.imageUrl} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 p-1" />
                  <div className="min-w-0 space-y-0.5">
                    <Link href={`/products/${item.slug}`} className="line-clamp-1 text-xs font-bold text-ink hover:text-brand sm:text-sm">
                      {item.name}
                    </Link>
                    {item.variantLabel ? <p className="text-[10px] text-slate-400">Option: <span className="text-slate-600">{item.variantLabel}</span></p> : null}
                  </div>
                </div>
                <div className="col-span-4 text-left text-xs font-bold text-ink sm:col-span-2 sm:text-center">
                  {formatCurrency(item.displayPrice, item.currency)}
                </div>
                <div className="col-span-4 flex justify-center sm:col-span-2">
                  <QuantityStepper value={item.quantity} onChange={(quantity) => updateQuantity(item.productId, item.variantId, quantity)} />
                </div>
                <div className="col-span-3 text-right text-[10px] text-slate-400 sm:col-span-2">At checkout</div>
                <div className="col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeItem(item.productId, item.variantId)} className="text-slate-400 hover:text-red-500" aria-label={`Remove ${item.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" className="rounded-full border-slate-200 text-xs font-bold text-brand">
            <Link href="/products"><ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping</Link>
          </Button>
          <Button variant="ghost" onClick={clearCart} className="text-xs font-semibold text-slate-400 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" /> Clear Cart
          </Button>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-4">
        <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-ink">Order Summary</h2>
          <p className="text-xs text-slate-500">
            Sign in to see your total. Prices, stock and discounts are confirmed by the store when your cart moves to your account.
          </p>
          <Button asChild className="h-11 w-full rounded-full bg-cta text-xs font-bold text-white shadow-md hover:opacity-95">
            <Link href={loginHref("/cart")}>
              <LogIn className="h-4 w-4" /> Sign In to Checkout
            </Link>
          </Button>
          <p className="text-center text-[11px] text-slate-500">
            New here? <Link href="/register?redirect=%2Fcart" className="font-bold text-brand hover:underline">Create an account</Link>
          </p>
        </Card>
        <TrustBadges />
        <AcceptedPayments />
      </div>
    </div>
  );
}
