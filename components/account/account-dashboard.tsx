"use client";

import { Bell, ChevronRight, Heart, LayoutDashboard, MapPin, Package } from "lucide-react";
import Link from "next/link";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { AddressSummary } from "@/components/account/address-summary";
import { ProductImage } from "@/components/storefront/product-image";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { OrderStatusBadge } from "@/components/storefront/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAddresses, useUnreadNotifications } from "@/hooks/use-account";
import { useWishlist } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import { useSession } from "@/hooks/use-session";
import { formatCurrency, formatShortDate } from "@/lib/utils/format";

function Stat({ href, icon: Icon, label, value }: { href: string; icon: typeof Package; label: string; value: number | string | undefined }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon className="h-5 w-5" /></div>
      <div>
        <p className="text-lg font-black text-ink">{value ?? "–"}</p>
        <p className="text-[11px] font-semibold text-slate-500">{label}</p>
      </div>
    </Link>
  );
}

export function AccountDashboard() {
  const { user } = useSession();
  const orders = useOrders({ page: 1, per_page: 3 });
  const wishlist = useWishlist();
  const unread = useUnreadNotifications();
  const addresses = useAddresses();
  const defaultAddress = addresses.data?.find((address) => address.isDefault) ?? addresses.data?.[0];

  return (
    <>
      <AccountPageHeader icon={LayoutDashboard} title={`Hi, ${user?.name.split(" ")[0] ?? "there"}!`} description="Here's what's happening with your account." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat href="/account/orders" icon={Package} label="Orders" value={orders.data?.meta?.total} />
        <Stat href="/account/wishlist" icon={Heart} label="Wishlist items" value={wishlist.data?.length} />
        <Stat href="/account/notifications" icon={Bell} label="Unread notifications" value={unread.data} />
        <Stat href="/account/addresses" icon={MapPin} label="Saved addresses" value={addresses.data?.length} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-ink">Recent Orders</h2>
            <Link href="/account/orders" className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">View all <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          {orders.isPending ? (
            <ListSkeleton rows={2} />
          ) : orders.isError ? (
            <ErrorState error={orders.error} onRetry={() => void orders.refetch()} />
          ) : orders.data.items.length === 0 ? (
            <EmptyState icon={Package} title="No orders yet" action={<Button asChild size="sm" className="rounded-full bg-brand"><Link href="/products">Start Shopping</Link></Button>} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {orders.data.items.map((order) => (
                <li key={order.orderNumber}>
                  <Link href={`/account/orders/${encodeURIComponent(order.orderNumber)}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                    <ProductImage src={order.items?.[0]?.imageUrl} alt={order.items?.[0]?.name ?? "Order"} className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 p-1" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-ink">#{order.orderNumber}</p>
                      <p className="text-[11px] text-slate-400">{formatShortDate(order.placedAt)}</p>
                    </div>
                    <div className="text-right">
                      <OrderStatusBadge status={order.status} />
                      <p className="mt-1 text-xs font-black text-ink">{formatCurrency(order.total, order.currency)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black text-ink">Profile</h2>
          <div className="text-xs text-slate-600">
            <p className="font-bold text-ink">{user?.name}</p>
            <p>{user?.email}</p>
            {user?.phone ? <p>{user.phone}</p> : null}
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Default address</p>
            {defaultAddress ? <AddressSummary address={defaultAddress} /> : <Link href="/account/addresses" className="text-xs font-semibold text-brand hover:underline">Add an address</Link>}
          </div>
          <Button asChild variant="outline" size="sm" className="w-full rounded-full text-xs"><Link href="/account/settings">Edit profile</Link></Button>
        </Card>
      </div>
    </>
  );
}
