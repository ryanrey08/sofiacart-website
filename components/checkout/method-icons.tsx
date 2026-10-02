import { Banknote, Building2, CreditCard, Smartphone, Truck, Zap, type LucideIcon } from "lucide-react";

export const paymentIcons: Record<string, { icon: LucideIcon; className: string }> = {
  card: { icon: CreditCard, className: "bg-brand/10 text-brand" },
  gcash: { icon: Smartphone, className: "bg-blue-600 text-white" },
  maya: { icon: Smartphone, className: "bg-emerald-600 text-white" },
  bank_transfer: { icon: Building2, className: "bg-blue-100 text-blue-700" },
  cod: { icon: Banknote, className: "bg-amber-100 text-amber-700" },
};

export function shippingIcon(code: string): LucideIcon {
  return code === "express" ? Zap : Truck;
}
