"use client";

import { CreditCard, Lock, MapPin, Plus, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AddressForm } from "@/components/account/address-form";
import { AddressSummary } from "@/components/account/address-summary";
import { CheckoutSummaryCard } from "@/components/checkout/checkout-summary-card";
import { paymentIcons, shippingIcon } from "@/components/checkout/method-icons";
import { CheckoutStepper } from "@/components/storefront/checkout-stepper";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { TrustBadges } from "@/components/storefront/trust-badges";
import { VoucherInput } from "@/components/storefront/voucher-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAddresses, useSaveAddress } from "@/hooks/use-account";
import { useCheckoutSummary, usePaymentMethods, useShippingMethods } from "@/hooks/use-checkout";
import { useSession } from "@/hooks/use-session";
import { ApiClientError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { useCheckoutStore } from "@/stores/checkout-store";
import { toast } from "@/stores/toast-store";
import type { PaymentMethodCode } from "@/types/domain";

const optionClass = (active: boolean) =>
  cn(
    "flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-all",
    active ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-slate-200 hover:border-slate-300"
  );

const radioDot = (active: boolean) => (
  <span className={cn("mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", active ? "border-brand" : "border-slate-300")}>
    {active ? <span className="h-2 w-2 rounded-full bg-brand" /> : null}
  </span>
);

function SectionTitle({ icon: Icon, children }: { icon: typeof MapPin; children: string }) {
  return (
    <div className="flex items-center gap-2 text-base font-black text-ink">
      <Icon className="h-5 w-5 text-brand" />
      <h2>{children}</h2>
    </div>
  );
}

export function CheckoutPageClient() {
  const router = useRouter();
  const { user } = useSession();
  const store = useCheckoutStore();
  const addresses = useAddresses();
  const shipping = useShippingMethods();
  const payments = usePaymentMethods();
  const saveAddress = useSaveAddress();
  const [addingAddress, setAddingAddress] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const addressList = addresses.data ?? [];
  // Keep the stored choice only if it still exists; otherwise fall back to the default address.
  const addressId =
    addressList.find((address) => address.id === store.addressId)?.id ??
    addressList.find((address) => address.isDefault)?.id ??
    addressList[0]?.id ??
    null;
  const shippingMethod = shipping.data?.shippingMethods.some((method) => method.code === store.shippingMethod)
    ? store.shippingMethod
    : (shipping.data?.shippingMethods[0]?.code ?? null);
  const paymentMethod = payments.data?.some((method) => method.code === store.paymentMethod) ? store.paymentMethod : null;

  const summary = useCheckoutSummary({ cartItemIds: store.cartItemIds, shippingMethod, voucherCode: store.voucherCode });
  const cartGone = summary.error instanceof ApiClientError && Boolean(summary.error.fieldError("cart") || summary.error.fieldError("cartItemIds"));

  function continueToReview() {
    setShowErrors(true);
    if (!addressId || !shippingMethod || !paymentMethod || summary.isError) {
      toast.error("Complete the checkout details", "Choose an address, delivery method and payment method.");
      return;
    }
    store.setDetails({ addressId, shippingMethod, paymentMethod });
    router.push("/place-order");
  }

  if (cartGone) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Nothing to check out"
        description="Your cart is empty or the selected items are no longer in it."
        action={<Button asChild className="rounded-full bg-brand"><Link href="/cart">Back to Cart</Link></Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <CheckoutStepper current="Checkout" />
        <div className="flex items-center gap-1.5 self-start rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1 text-xs text-amber-700">
          <Lock className="h-3.5 w-3.5 text-amber-600" />
          <strong className="font-bold">Secure Checkout</strong>
          <span className="hidden text-amber-600/80 sm:inline">| Your information is protected</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Shipping information */}
          <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionTitle icon={MapPin}>1. Shipping Information</SectionTitle>
              {addressList.length > 0 && !addingAddress ? (
                <Button variant="ghost" size="sm" className="text-xs font-bold text-brand" onClick={() => setAddingAddress(true)}>
                  <Plus className="h-3.5 w-3.5" /> New address
                </Button>
              ) : null}
            </div>
            {user ? <p className="text-[11px] text-slate-500">Order updates go to <span className="font-semibold text-slate-700">{user.email}</span></p> : null}

            {addresses.isPending ? (
              <ListSkeleton rows={2} />
            ) : addresses.isError ? (
              <ErrorState error={addresses.error} onRetry={() => void addresses.refetch()} title="Addresses couldn't be loaded" />
            ) : addingAddress || addressList.length === 0 ? (
              <div className="space-y-2">
                {addressList.length === 0 ? <p className="text-xs text-slate-500">Add a delivery address to continue. It will be saved to your address book.</p> : null}
                <AddressForm
                  pending={saveAddress.isPending}
                  error={saveAddress.error}
                  submitLabel="Use This Address"
                  onCancel={addressList.length > 0 ? () => setAddingAddress(false) : undefined}
                  onSubmit={(payload, setServerErrors) =>
                    saveAddress.mutate(
                      { payload },
                      {
                        onSuccess: (address) => {
                          store.setDetails({ addressId: address.id });
                          setAddingAddress(false);
                          toast.success("Address saved");
                        },
                        onError: setServerErrors,
                      }
                    )
                  }
                />
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery address">
                {addressList.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    role="radio"
                    aria-checked={address.id === addressId}
                    onClick={() => store.setDetails({ addressId: address.id })}
                    className={optionClass(address.id === addressId)}
                  >
                    {radioDot(address.id === addressId)}
                    <div className="min-w-0">
                      <AddressSummary address={address} />
                      {address.isDefault ? <span className="mt-1 inline-block text-[10px] font-bold text-brand">Default address</span> : null}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showErrors && !addressId && !addingAddress ? <p className="text-[11px] text-red-600">Choose a delivery address.</p> : null}
          </Card>

          {/* 2. Delivery method */}
          <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <SectionTitle icon={Truck}>2. Delivery Method</SectionTitle>
            {shipping.isPending ? (
              <ListSkeleton rows={1} />
            ) : shipping.isError ? (
              <ErrorState error={shipping.error} onRetry={() => void shipping.refetch()} />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery method">
                  {shipping.data.shippingMethods.map((method) => {
                    const Icon = shippingIcon(method.code);
                    const active = method.code === shippingMethod;
                    return (
                      <button key={method.code} type="button" role="radio" aria-checked={active} onClick={() => store.setDetails({ shippingMethod: method.code })} className={optionClass(active)}>
                        {radioDot(active)}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-ink">{method.name}</p>
                          {method.description ? <p className="text-[10px] text-slate-500">{method.description}</p> : null}
                          <p className="pt-1 text-xs font-black text-ink">{formatCurrency(method.fee, method.currency)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {shipping.data.freeShippingThreshold ? (
                  <p className="text-[11px] text-slate-500">Free shipping on store orders of {formatCurrency(shipping.data.freeShippingThreshold)} or more.</p>
                ) : null}
              </>
            )}
          </Card>

          {/* 3. Payment method */}
          <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <SectionTitle icon={CreditCard}>3. Payment Method</SectionTitle>
            {payments.isPending ? (
              <ListSkeleton rows={2} />
            ) : payments.isError ? (
              <ErrorState error={payments.error} onRetry={() => void payments.refetch()} />
            ) : (
              <div className="space-y-2.5" role="radiogroup" aria-label="Payment method">
                {payments.data.map((method) => {
                  const visual = paymentIcons[method.code] ?? paymentIcons.card;
                  const Icon = visual.icon;
                  const active = method.code === paymentMethod;
                  return (
                    <button
                      key={method.code}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => store.setDetails({ paymentMethod: method.code as PaymentMethodCode })}
                      className={cn(optionClass(active), "items-center p-3.5")}
                    >
                      {radioDot(active)}
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", visual.className)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">{method.name}</p>
                        {method.description ? <p className="text-[10px] text-slate-500">{method.description}</p> : null}
                      </div>
                    </button>
                  );
                })}
                <p className="text-[11px] text-slate-500">
                  SofiaCart never asks for card numbers. The store confirms your payment; e-wallet and bank payments can add a reference number after ordering.
                </p>
              </div>
            )}
            {showErrors && !paymentMethod ? <p className="text-[11px] text-red-600">Choose a payment method.</p> : null}
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <CheckoutSummaryCard
            summary={summary.data}
            pending={summary.isPending}
            fetching={summary.isFetching}
            error={summary.error}
            shippingChosen={Boolean(shippingMethod)}
          >
            <Separator className="bg-slate-100" />
            <VoucherInput
              appliedCode={store.voucherCode}
              cartItemIds={store.cartItemIds}
              onApply={(code) => {
                store.setVoucherCode(code);
                toast.success("Promo code applied", code);
              }}
              onRemove={() => store.setVoucherCode(null)}
            />
            <Button
              onClick={continueToReview}
              disabled={summary.isPending || summary.isError || addingAddress}
              className="h-11 w-full rounded-full bg-cta text-xs font-bold text-white shadow-md hover:opacity-95"
            >
              <Lock className="h-4 w-4" /> Review Order →
            </Button>
          </CheckoutSummaryCard>
          <TrustBadges />
        </div>
      </div>
    </div>
  );
}
