"use client";

import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { OrderDetail } from "@/components/orders/order-detail";
import { Pagination } from "@/components/storefront/pagination";
import { ProductImage } from "@/components/storefront/product-image";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { OrderStatusBadge } from "@/components/storefront/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOrders } from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { formatCurrency, formatShortDate } from "@/lib/utils/format";
import type { OrderStatus } from "@/types/domain";

// Order statuses that exist in the shared database (sofiacart-backend OrderStatus).
const tabs: { value: OrderStatus | null; label: string }[] = [
  { value: null, label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function MyOrders() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as OrderStatus | null;
  const status = tabs.some((tab) => tab.value === statusParam) ? statusParam : null;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const orders = useOrders({ status: status ?? undefined, page, per_page: 10 });
  const items = orders.data?.items ?? [];
  const selected = searchParams.get("order") ?? items[0]?.orderNumber ?? null;

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <>
      <AccountPageHeader icon={Package} title="My Orders" description="View and track all your orders." />

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 [scrollbar-width:none]" role="tablist" aria-label="Order status">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={status === tab.value}
            onClick={() => update({ status: tab.value, page: null, order: null })}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors",
              status === tab.value ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {orders.isPending ? (
        <ListSkeleton rows={4} />
      ) : orders.isError ? (
        <ErrorState error={orders.error} onRetry={() => void orders.refetch()} title="Your orders couldn't be loaded" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title={status ? `No ${status} orders` : "No orders yet"}
          description={status ? "Orders with this status will appear here." : "When you place an order, you can track it here."}
          action={<Button asChild className="rounded-full bg-brand"><Link href="/products">Start Shopping</Link></Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-3">
            <ul className={cn("space-y-3", orders.isFetching && "opacity-60")}>
              {items.map((order) => {
                const active = order.orderNumber === selected;
                const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
                return (
                  <li key={order.orderNumber}>
                    <Card
                      className={cn(
                        "flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-colors sm:flex-row sm:items-center",
                        active ? "border-brand/50 bg-brand/[0.03] xl:ring-1 xl:ring-brand/30" : "border-slate-100"
                      )}
                    >
                      <button type="button" onClick={() => update({ order: order.orderNumber })} className="flex min-w-0 flex-1 items-center gap-4 text-left" aria-pressed={active}>
                        <div className="flex shrink-0 gap-1">
                          {(order.items ?? []).slice(0, 3).map((item, index) => (
                            <ProductImage
                              key={item.id}
                              src={item.imageUrl}
                              alt={item.name}
                              className={cn("h-14 w-14 rounded-xl border border-slate-100 p-1", index > 0 && "hidden sm:flex")}
                            />
                          ))}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="break-all text-sm font-bold text-ink">Order #{order.orderNumber}</p>
                          <p className="text-[11px] text-slate-400">
                            {formatShortDate(order.placedAt)} • {itemCount} item{itemCount === 1 ? "" : "s"}
                            {order.store ? ` • ${order.store.name}` : ""}
                          </p>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </button>
                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <p className="text-sm font-black text-ink">{formatCurrency(order.total, order.currency)}</p>
                        <div className="flex items-center gap-1">
                          <Button asChild variant="outline" size="sm" className="h-8 rounded-xl border-brand/30 text-[11px] font-bold text-brand">
                            <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}>View Details</Link>
                          </Button>
                          <ChevronRight className="hidden h-4 w-4 text-slate-300 sm:block" />
                        </div>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
            <Pagination page={page} lastPage={orders.data.meta?.lastPage ?? 1} disabled={orders.isFetching} onPageChange={(next) => update({ page: String(next), order: null })} />
          </div>

          {selected ? (
            <aside className="hidden h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:sticky xl:top-36 xl:block" aria-label="Selected order">
              <OrderDetail key={selected} orderNumber={selected} variant="panel" />
            </aside>
          ) : null}
        </div>
      )}
    </>
  );
}
