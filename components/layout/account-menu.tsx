"use client";

import { Bell, ChevronDown, Heart, LogIn, LogOut, Package, Settings, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PopoverMenu } from "@/components/ui/popover-menu";
import { useUnreadNotifications } from "@/hooks/use-account";
import { useLogout } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { toast } from "@/stores/toast-store";

const itemClass = "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand/5 hover:text-brand";

export function AccountMenu() {
  const { hydrated, user, isAuthenticated } = useSession();
  const unread = useUnreadNotifications();
  const logout = useLogout();
  const router = useRouter();
  const firstName = user?.name.split(" ")[0];
  const unreadCount = unread.data ?? 0;

  return (
    <PopoverMenu
      label="Account menu"
      trigger={(open) => (
        <span className="flex items-center gap-2 rounded-full p-1 text-xs font-semibold text-slate-700 hover:bg-brand/5 hover:text-brand sm:rounded-xl">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
            <User className="h-4 w-4" />
            {unreadCount > 0 ? <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-pink" /> : null}
          </span>
          <span className="hidden items-center gap-1 md:flex">
            {hydrated ? (isAuthenticated ? `Hi, ${firstName}` : "Sign In") : "Account"}
            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </span>
        </span>
      )}
    >
      {(close) =>
        isAuthenticated ? (
          <div className="space-y-1">
            <div className="border-b border-slate-100 px-3 pb-2 pt-1">
              <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
              <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
            </div>
            <Link href="/account" onClick={close} className={itemClass} role="menuitem"><User className="h-4 w-4" /> My Account</Link>
            <Link href="/account/orders" onClick={close} className={itemClass} role="menuitem"><Package className="h-4 w-4" /> My Orders</Link>
            <Link href="/account/wishlist" onClick={close} className={itemClass} role="menuitem"><Heart className="h-4 w-4" /> Wishlist</Link>
            <Link href="/account/notifications" onClick={close} className={itemClass} role="menuitem">
              <Bell className="h-4 w-4" /> Notifications
              {unreadCount > 0 ? <span className="ml-auto rounded-full bg-brand-pink px-1.5 text-[10px] font-bold text-white">{unreadCount}</span> : null}
            </Link>
            <Link href="/account/settings" onClick={close} className={itemClass} role="menuitem"><Settings className="h-4 w-4" /> Account Settings</Link>
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} border-t border-slate-100 text-red-600 hover:text-red-600`}
              disabled={logout.isPending}
              onClick={() => {
                close();
                // Leave any protected page first so the auth guard doesn't redirect to the login page.
                router.push("/");
                logout.mutate({}, { onSettled: () => toast.info("You have been signed out") });
              }}
            >
              <LogOut className="h-4 w-4" /> {logout.isPending ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link href="/login" onClick={close} className={itemClass} role="menuitem"><LogIn className="h-4 w-4" /> Sign In</Link>
            <Link href="/register" onClick={close} className={itemClass} role="menuitem"><UserPlus className="h-4 w-4" /> Create Account</Link>
          </div>
        )
      }
    </PopoverMenu>
  );
}
