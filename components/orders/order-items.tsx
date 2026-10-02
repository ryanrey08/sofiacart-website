import Link from "next/link";

import { ProductImage } from "@/components/storefront/product-image";
import { formatCurrency } from "@/lib/utils/format";
import type { OrderItem } from "@/types/domain";

export function OrderItems({ items, currency }: { items: OrderItem[]; currency: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ProductImage src={item.imageUrl} alt={item.name} className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 p-1" />
            <div className="min-w-0">
              {item.slug ? (
                <Link href={`/products/${item.slug}`} className="line-clamp-1 text-xs font-bold text-ink hover:text-brand">{item.name}</Link>
              ) : (
                <p className="line-clamp-1 text-xs font-bold text-ink">{item.name}</p>
              )}
              <p className="text-[10px] text-slate-400">
                {item.sku ? `SKU ${item.sku} · ` : ""}
                {formatCurrency(item.unitPrice, currency)} × {item.quantity}
              </p>
            </div>
          </div>
          <p className="shrink-0 text-xs font-bold text-ink">{formatCurrency(item.total, currency)}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ order }: { order: { subtotal: number; discount: number; shipping: number; total: number; currency: string } }) {
  return (
    <div className="space-y-2 text-xs text-slate-600">
      <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-ink">{formatCurrency(order.subtotal, order.currency)}</span></div>
      {order.discount > 0 ? (
        <div className="flex justify-between font-semibold text-emerald-600"><span>Discount</span><span>-{formatCurrency(order.discount, order.currency)}</span></div>
      ) : null}
      <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-ink">{formatCurrency(order.shipping, order.currency)}</span></div>
      <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
        <span className="text-sm font-black text-ink">Total Amount</span>
        <div className="text-right">
          <span className="text-lg font-black text-ink">{formatCurrency(order.total, order.currency)}</span>
          <p className="text-[9px] text-slate-400">Inclusive of VAT (if applicable)</p>
        </div>
      </div>
    </div>
  );
}
