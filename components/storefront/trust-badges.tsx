"use client";

import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { usePaymentMethods, useShippingMethods } from "@/hooks/use-checkout";
import { formatCurrency } from "@/lib/utils/format";

/** Guarantee badges from the Canva cart/checkout screens, worded from what the backend supports. */
export function TrustBadges() {
  const shipping = useShippingMethods();
  const threshold = shipping.data?.freeShippingThreshold;

  const badges = [
    {
      icon: Truck,
      title: threshold ? "Free Shipping" : "Fast Delivery",
      text: threshold ? `on orders ${formatCurrency(threshold)}+` : "Standard & express",
    },
    { icon: ShieldCheck, title: "Secure Payment", text: "Verified by the store" },
    { icon: RotateCcw, title: "Easy Returns", text: "Request online" },
    { icon: Headphones, title: "Customer Support", text: "We're here to help" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
      {badges.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex flex-col items-center">
          <Icon className="mb-1 h-4 w-4 text-brand" />
          <span className="text-[10px] font-bold text-slate-800">{title}</span>
          <span className="text-[8px] text-slate-400">{text}</span>
        </div>
      ))}
    </div>
  );
}

const methodStyles: Record<string, string> = {
  card: "bg-slate-100 text-blue-700",
  gcash: "bg-blue-600 text-white",
  maya: "bg-emerald-600 text-white",
  bank_transfer: "bg-blue-900 text-white",
  cod: "bg-slate-200 text-slate-700",
};

export function AcceptedPayments() {
  const { data } = usePaymentMethods();
  if (!data?.length) return null;

  return (
    <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold text-ink">We Accept</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {data.map((method) => (
          <span key={method.code} className={`rounded px-2 py-1 text-[9px] font-bold ${methodStyles[method.code] ?? "bg-slate-100 text-slate-700"}`}>
            {method.name}
          </span>
        ))}
      </div>
    </div>
  );
}
