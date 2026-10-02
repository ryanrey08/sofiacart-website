import Link from "next/link";
import { Search, Heart, User, ChevronDown, UserRound } from "lucide-react";

import { Navigation } from "@/components/layout/navigation";
import { CartIndicator } from "@/components/layout/cart-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/constants/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-purple-100 bg-background/95 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-4 py-3 md:gap-6">
        {/* Brand Logo & Main Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* Gradient Logo Icon */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF2A7A] via-[#FF6B00] to-[#7C3AED] text-white shadow-md">
              <span className="text-xl font-black italic">S</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-extrabold tracking-tight text-[#2D157B]">
                Sofia<span className="text-[#FF6B00]">Cart</span>
              </div>
              <p className="text-[9px] font-medium tracking-wider text-slate-500">
                — Everything. In One Cart. —
              </p>
            </div>
          </Link>

          <Navigation className="hidden lg:flex" />
        </div>

        {/* Search Bar */}
        <div className="relative flex flex-1 max-w-md items-center">
          <Input
            type="text"
            placeholder="Search for products, categories or brands..."
            className="h-10 w-full rounded-full border-purple-100 bg-purple-50/50 pr-12 pl-4 text-xs sm:text-sm focus-visible:ring-[#7C3AED]"
          />
          <Button
            size="icon"
            className="absolute right-1 h-8 w-8 rounded-full bg-[#5B3DF5] text-white hover:bg-[#4828E0]"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Actions: Wishlist, Cart & Account */}
        <div className="flex items-center gap-3 sm:gap-5 text-slate-700">
          {/* Wishlist Button */}
          <Link
            href="/wishlist"
            className="hidden sm:flex flex-col items-center gap-0.5 text-xs font-medium hover:text-[#5B3DF5] transition-colors"
          >
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
          </Link>

          {/* Cart Indicator Component */}
          <CartIndicator />

          {/* User Account Section */}
          <div className="flex items-center border-l border-slate-200 pl-3 sm:pl-4">
            <Button
              variant="ghost"
              asChild
              className="h-auto p-1 hover:bg-purple-50 hover:text-[#5B3DF5] rounded-full sm:rounded-xl"
            >
              <Link href="/register" className="flex items-center gap-2 text-xs font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:flex items-center gap-1">
                  Hi, Juan
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}