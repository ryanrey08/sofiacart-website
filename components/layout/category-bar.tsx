"use client";

import { ChevronDown, LayoutGrid } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PopoverMenu } from "@/components/ui/popover-menu";
import { uniqueTopCategories, useCategories } from "@/hooks/use-catalog";
import { useHydrated } from "@/hooks/use-session";

export function categoryHref(category: { id: number; name: string }) {
  return `/products?category_id=${category.id}&category=${encodeURIComponent(category.name)}`;
}

/** Second header row: "All Categories" menu, top categories from the API, and Deals. */
export function CategoryBar() {
  const hydrated = useHydrated();
  const { data } = useCategories();
  const categories = hydrated ? uniqueTopCategories(data) : [];

  return (
    <div className="border-t border-slate-100">
      <Container className="flex h-11 items-center gap-5 text-xs font-medium text-slate-700">
        <PopoverMenu
          label="All categories"
          align="left"
          className="max-h-[60vh] overflow-y-auto"
          trigger={(open) => (
            <span className="flex shrink-0 items-center gap-1.5 font-semibold hover:text-brand">
              <LayoutGrid className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">All Categories</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </span>
          )}
        >
          {(close) => (
            <div className="grid gap-0.5">
              {categories.map((category) => (
                <Link key={category.id} href={categoryHref(category)} onClick={close} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand/5 hover:text-brand">
                  {category.name}
                </Link>
              ))}
              <Link href="/categories" onClick={close} className="mt-1 rounded-xl border-t border-slate-100 px-3 py-2 text-xs font-bold text-brand">
                View all categories →
              </Link>
            </div>
          )}
        </PopoverMenu>
        <nav aria-label="Categories" className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          {categories.slice(0, 9).map((category) => (
            <Link key={category.id} href={categoryHref(category)} className="hover:text-brand">
              {category.name}
            </Link>
          ))}
        </nav>
        <Link href="/vouchers" className="shrink-0 font-bold text-red-500 hover:text-red-600">
          Deals
        </Link>
      </Container>
    </div>
  );
}
