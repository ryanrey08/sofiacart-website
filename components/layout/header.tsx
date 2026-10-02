import { Heart } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { AccountMenu } from "@/components/layout/account-menu";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CartIndicator } from "@/components/layout/cart-indicator";
import { CategoryBar } from "@/components/layout/category-bar";
import { Container } from "@/components/layout/container";
import { HeaderSearch, HeaderSearchFallback } from "@/components/layout/header-search";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand/10 bg-white/95 backdrop-blur-md">
      <Container className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 md:h-20 md:flex-nowrap md:gap-6 md:py-0">
        <BrandLogo />

        <div className="order-last w-full md:order-none md:max-w-xl md:flex-1">
          <Suspense fallback={<HeaderSearchFallback />}>
            <HeaderSearch />
          </Suspense>
        </div>

        <div className="flex items-center gap-4 text-slate-700 sm:gap-5">
          <Link href="/account/wishlist" className="hidden flex-col items-center gap-0.5 text-xs font-medium hover:text-brand sm:flex">
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
          </Link>
          <CartIndicator />
          <div className="border-l border-slate-200 pl-3 sm:pl-4">
            <AccountMenu />
          </div>
        </div>
      </Container>
      <CategoryBar />
    </header>
  );
}
