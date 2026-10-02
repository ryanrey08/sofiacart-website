"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useUnreadNotifications } from "@/hooks/use-account";
import { useLogout } from "@/hooks/use-auth";
import { accountNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/toast-store";

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const unread = useUnreadNotifications();

  const isActive = (href: string) => (href === "/account" ? pathname === href : pathname.startsWith(href));

  function signOut() {
    // Leave the protected page first so the auth guard doesn't redirect to the login page.
    router.push("/");
    logout.mutate({}, { onSettled: () => toast.info("You have been signed out") });
  }

  return (
    <nav aria-label="Account" className="lg:sticky lg:top-36 lg:h-fit">
      <ul className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm [scrollbar-width:none] lg:flex-col lg:overflow-visible">
        {accountNavigation.map(({ href, label, icon: Icon }) => (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                isActive(href) ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-50 hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {href === "/account/notifications" && (unread.data ?? 0) > 0 ? (
                <span className="ml-auto rounded-full bg-brand-pink px-1.5 text-[10px] font-bold text-white">{unread.data}</span>
              ) : null}
            </Link>
          </li>
        ))}
        <li className="shrink-0 lg:mt-1 lg:border-t lg:border-slate-100 lg:pt-1">
          <button
            type="button"
            onClick={signOut}
            disabled={logout.isPending}
            className="flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> {logout.isPending ? "Signing out…" : "Logout"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
