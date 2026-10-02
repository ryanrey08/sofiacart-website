"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { Pagination } from "@/components/storefront/pagination";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { useDeleteNotification, useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/use-account";
import { errorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const notifications = useNotifications({ page, per_page: 15, unread: unreadOnly || undefined });
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const remove = useDeleteNotification();
  const unreadCount = notifications.data?.unreadCount ?? 0;

  return (
    <>
      <AccountPageHeader
        icon={Bell}
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
        action={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            disabled={unreadCount === 0 || markAll.isPending}
            onClick={() => markAll.mutate(undefined, { onError: (error) => toast.error("Couldn't update notifications", errorMessage(error)) })}
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
          </Button>
        }
      />
      <div className="flex gap-2">
        {[false, true].map((value) => (
          <button
            key={String(value)}
            type="button"
            onClick={() => {
              setUnreadOnly(value);
              setPage(1);
            }}
            aria-pressed={unreadOnly === value}
            className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", unreadOnly === value ? "bg-brand text-white" : "bg-white text-slate-600 hover:bg-slate-100")}
          >
            {value ? "Unread" : "All"}
          </button>
        ))}
      </div>
      {notifications.isPending ? (
        <ListSkeleton rows={3} />
      ) : notifications.isError ? (
        <ErrorState error={notifications.error} onRetry={() => void notifications.refetch()} />
      ) : notifications.data.notifications.length === 0 ? (
        <EmptyState icon={Bell} title={unreadOnly ? "No unread notifications" : "No notifications yet"} description="Updates about your orders, payments and returns show up here." />
      ) : (
        <>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {notifications.data.notifications.map((notification) => {
              const orderNumber = typeof notification.data.orderNumber === "string" ? notification.data.orderNumber : null;
              return (
                <li key={notification.id} className={cn("flex items-start gap-3 p-4", !notification.read && "bg-brand/[0.04]")}>
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", notification.read ? "bg-transparent" : "bg-brand-pink")} aria-label={notification.read ? undefined : "Unread"} />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-ink">{notification.title}</p>
                    {notification.body ? <p className="text-xs text-slate-600">{notification.body}</p> : null}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>{formatDateTime(notification.createdAt)}</span>
                      {orderNumber ? (
                        <Link href={`/account/orders/${encodeURIComponent(orderNumber)}`} className="font-semibold text-brand hover:underline">View order</Link>
                      ) : null}
                      {!notification.read ? (
                        <button type="button" className="font-semibold text-slate-500 hover:text-brand" disabled={markRead.isPending} onClick={() => markRead.mutate(notification.id)}>
                          Mark as read
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Delete notification"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(notification.id, { onError: (error) => toast.error("Couldn't delete notification", errorMessage(error)) })}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          <Pagination page={page} lastPage={notifications.data.meta?.lastPage ?? 1} onPageChange={setPage} disabled={notifications.isFetching} />
        </>
      )}
    </>
  );
}
