import { ArrowRight, Award, Headphones, Home as HomeIcon, Laptop, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { CategorySidebar, FeaturedCategories, PopularProducts } from "@/components/storefront/home-sections";
import { Button } from "@/components/ui/button";

const trustSignals = [
  { icon: Truck, title: "Fast Delivery", subtitle: "Nationwide Shipping" },
  { icon: ShieldCheck, title: "Secure Payment", subtitle: "Multiple Payment Options" },
  { icon: Award, title: "Quality Products", subtitle: "Trusted Sellers" },
  { icon: Headphones, title: "Customer Support", subtitle: "We're Here to Help" },
];

export default function Home() {
  return (
    <Container className="space-y-8 py-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <CategorySidebar />

        {/* Hero banner */}
        <div className="relative flex min-h-[320px] flex-col justify-center overflow-hidden rounded-2xl border border-brand/10 bg-gradient-to-r from-[#FFE5EC] via-[#F3E8FF] to-[#E0E7FF] p-8 shadow-sm lg:col-span-6">
          <div className="z-10 max-w-xs space-y-3">
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Shop Smarter <br />
              Live Better
            </h1>
            <p className="text-xs font-medium text-slate-600">
              Discover great products, amazing deals and everything you need in one cart.
            </p>
            <Button asChild className="mt-2 rounded-full bg-cta px-6 text-xs font-bold text-white shadow-md hover:opacity-90">
              <Link href="/products">
                Shop Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <ShoppingCart aria-hidden className="pointer-events-none absolute -bottom-6 -right-6 h-56 w-56 rotate-[-8deg] text-brand/15 sm:h-72 sm:w-72" />
        </div>

        {/* Side promotions */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <Link
            href="/products?search=electronics"
            className="relative flex flex-1 items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] p-5 shadow-sm"
          >
            <div className="z-10 max-w-[150px] space-y-2">
              <h3 className="text-sm font-bold leading-snug text-ink">Best Deals on Electronics</h3>
              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-brand px-3 text-[10px] font-bold text-white">
                Shop Now <ArrowRight className="h-3 w-3" />
              </span>
            </div>
            <Laptop aria-hidden className="h-16 w-16 text-brand/40" />
          </Link>
          <Link
            href="/products?search=home"
            className="relative flex flex-1 items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA] p-5 shadow-sm"
          >
            <div className="z-10 max-w-[150px] space-y-2">
              <h3 className="text-sm font-bold leading-snug text-ink">Home Essentials For a Better Living</h3>
              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-brand-orange px-3 text-[10px] font-bold text-white">
                Shop Now <ArrowRight className="h-3 w-3" />
              </span>
            </div>
            <HomeIcon aria-hidden className="h-16 w-16 text-brand-orange/40" />
          </Link>
        </div>
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:grid-cols-4">
        {trustSignals.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/5 text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">{title}</h4>
              <p className="text-[10px] text-slate-500">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <FeaturedCategories />
      <PopularProducts />
    </Container>
  );
}
