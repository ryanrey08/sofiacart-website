"use client";

import { Check, CreditCard, FileText, Lock, LockKeyhole, MapPin, Pencil, ShoppingBag, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createElement, useState } from "react";

import { AddressSummary } from "@/components/account/address-summary";
import { CheckoutSummaryCard } from "@/components/checkout/checkout-summary-card";
import { paymentIcons, shippingIcon } from "@/components/checkout/method-icons";
import { CheckoutStepper } from "@/components/storefront/checkout-stepper";
import { ProductImage } from "@/components/storefront/product-image";
import { InlineError } from "@/components/storefront/states";
import { TrustBadges } from "@/components/storefront/trust-badges";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useAddresses } from "@/hooks/use-account";
import { useCheckoutSummary, usePaymentMethods, usePlaceOrder, useShippingMethods } from "@/hooks/use-checkout";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { useCheckoutStore } from "@/stores/checkout-store";
import { toast } from "@/stores/toast-store";

function InfoCard({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Icon className="h-4 w-4" />
          </div>
          <h2>{title}</h2>
        </div>
        <Link href="/checkout" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
          <Pencil className="h-3 w-3" /> Edit
        </Link>
      </div>
      {children}
    </Card>
  );
}

export function PlaceOrderClient() {
  const router = useRouter();
  const store = useCheckoutStore();
  const addresses = useAddresses();
  const shipping = useShippingMethods();
  const payments = usePaymentMethods();
  const placeOrder = usePlaceOrder();
  const [agreed, setAgreed] = useState(false);

  const address = addresses.data?.find((entry) => entry.id === store.addressId);
  const shippingMethod = shipping.data?.shippingMethods.find((method) => method.code === store.shippingMethod);
  const paymentMethod = payments.data?.find((method) => method.code === store.paymentMethod);
  const detailsReady = Boolean(store.addressId && store.shippingMethod && store.paymentMethod);
  const detailsMissing = addresses.isSuccess && shipping.isSuccess && payments.isSuccess && (!address || !shippingMethod || !paymentMethod);

  const summary = useCheckoutSummary(
    { cartItemIds: store.cartItemIds, shippingMethod: store.shippingMethod, voucherCode: store.voucherCode },
    detailsReady
  );

  if (!detailsReady || detailsMissing) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-ink">Your checkout details are incomplete</p>
        <p className="text-xs text-slate-500">Choose a delivery address, delivery method and payment method first.</p>
        <Button asChild className="rounded-full bg-brand"><Link href="/checkout">Go to Checkout</Link></Button>
      </div>
    );
  }

  function submit() {
    if (!agreed || !store.addressId || !store.shippingMethod || !store.paymentMethod) return;
    const idempotencyKey = store.ensureIdempotencyKey();

    placeOrder.mutate(
      {
        idempotencyKey,
        payload: {
          addressId: store.addressId,
          shippingMethod: store.shippingMethod,
          paymentMethod: store.paymentMethod,
          voucherCode: store.voucherCode,
          cartItemIds: store.cartItemIds,
          notes: store.notes.trim() || null,
        },
      },
      {
        onSuccess: (checkout) => {
          store.completeCheckout(checkout);
          toast.success("Order placed!", `Reference ${checkout.reference}`);
          router.replace(`/order/complete?ref=${encodeURIComponent(checkout.reference)}`);
        },
      }
    );
  }

  const items = summary.data?.orders.flatMap((group) => group.items.map((line) => ({ ...line, store: group.store }))) ?? [];
  const paymentIcon = (paymentIcons[paymentMethod?.code ?? "card"] ?? paymentIcons.card).icon;

  return (
    <div className="space-y-6">
      <div className="flex justify-center"><CheckoutStepper current="Place Order" /></div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink">Review Your Order</h1>
          <p className="text-xs font-medium text-slate-500">Please review your details before placing your order.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard icon={MapPin} title="Shipping Information">
              {address ? <AddressSummary address={address} /> : <p className="text-xs text-slate-400">Loading…</p>}
            </InfoCard>
            <InfoCard icon={Truck} title="Delivery Method">
              {shippingMethod ? (
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand/5 text-brand">
                    {createElement(shippingIcon(shippingMethod.code), { className: "h-5 w-5" })}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{shippingMethod.name}</p>
                    <p className="text-[11px] text-slate-400">{shippingMethod.description}</p>
                    <p className="pt-0.5 font-bold text-ink">{formatCurrency(shippingMethod.fee, shippingMethod.currency)}{summary.data && summary.data.orders.length > 1 ? " per store" : ""}</p>
                  </div>
                </div>
              ) : null}
            </InfoCard>
            <InfoCard icon={CreditCard} title="Payment Method">
              {paymentMethod ? (
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <div className={cn("flex h-8 w-10 shrink-0 items-center justify-center rounded-lg", paymentIcons[paymentMethod.code]?.className)}>
                    {createElement(paymentIcon, { className: "h-4 w-4" })}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{paymentMethod.name}</p>
                    <p className="text-[11px] text-slate-400">{paymentMethod.description}</p>
                  </div>
                </div>
              ) : null}
            </InfoCard>
          </div>

          <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <ShoppingCart className="h-4 w-4 text-brand" />
                <h2>Order Items <span className="font-normal text-slate-400">({items.length} item{items.length === 1 ? "" : "s"})</span></h2>
              </div>
              <Link href="/cart" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                <Pencil className="h-3 w-3" /> Edit Cart
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-2">Product</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-center">Quantity</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {items.map((line) => (
                    <tr key={line.cartItemId}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <ProductImage src={line.imageUrl} alt={line.name} className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 p-1" />
                          <div>
                            <p className="line-clamp-1 font-bold text-ink">{line.name}</p>
                            <p className="text-[11px] text-slate-400">Store: <span className="text-slate-600">{line.store.name}</span></p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-ink">{formatCurrency(line.unitPrice, summary.data?.currency)}</td>
                      <td className="py-4 text-center font-semibold text-slate-600">{line.quantity}</td>
                      <td className="py-4 text-right font-bold text-ink">{formatCurrency(line.lineTotal, summary.data?.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="space-y-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <label htmlFor="order-notes" className="flex items-center gap-2 text-sm font-bold text-ink">
              <FileText className="h-4 w-4 text-brand" /> Order Notes <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              id="order-notes"
              value={store.notes}
              onChange={(event) => store.setDetails({ notes: event.target.value })}
              maxLength={1000}
              placeholder="Delivery instructions for the store"
              className="rounded-xl text-xs"
            />
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <CheckoutSummaryCard summary={summary.data} pending={summary.isPending} fetching={summary.isFetching} error={summary.error} shippingChosen>
            <div className="space-y-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-3 w-3" />
                </div>
                Before you place your order
              </div>
              <div className="flex items-start gap-2 pl-1">
                <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(Boolean(checked))} className="mt-0.5" />
                <label htmlFor="agree" className="cursor-pointer text-xs text-slate-700">
                  I agree to the SofiaCart Terms and Conditions and Privacy Policy.
                </label>
              </div>
            </div>
            <InlineError error={placeOrder.error} />
            <Button
              onClick={submit}
              disabled={!agreed || placeOrder.isPending || summary.isPending || summary.isError}
              className="h-12 w-full rounded-2xl bg-cta text-sm font-bold text-white shadow-lg shadow-pink-500/20 hover:opacity-95"
            >
              <Lock className="h-4 w-4" /> {placeOrder.isPending ? "Placing your order…" : "Place Order →"}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <LockKeyhole className="h-3.5 w-3.5" /> Totals are confirmed by SofiaCart when you place your order.
            </p>
          </CheckoutSummaryCard>
          <TrustBadges />
        </div>
      </div>
    </div>
  );
}
