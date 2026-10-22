import { ArrowRight, Award, Headphones, Home as HomeIcon, Laptop, Mail, MapPin, Phone, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { StoreImage } from "@/components/store/store-image";
import { CategorySidebar, FeaturedCategories, PopularProducts } from "@/components/storefront/home-sections";
import { Button } from "@/components/ui/button";
import { getCurrentStore } from "@/lib/store/current-store";
import type { StoreProfile } from "@/types/domain";

const trustSignals = [
  { icon: Truck, title: "Fast Delivery", subtitle: "Nationwide Shipping" },
  { icon: ShieldCheck, title: "Secure Payment", subtitle: "Multiple Payment Options" },
  { icon: Award, title: "Quality Products", subtitle: "Trusted Sellers" },
  { icon: Headphones, title: "Customer Support", subtitle: "We're Here to Help" },
];

/** A store's own home page hero: its banner, logo, name and description. */
function StoreHero({ store }: { store: StoreProfile }) {
  return (
    <div className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-brand/10 bg-gradient-to-r from-[#FFE5EC] via-[#F3E8FF] to-[#E0E7FF] shadow-sm lg:col-span-6">
      {store.bannerUrl ? <StoreImage src={store.bannerUrl} className="absolute inset-0 h-full w-full object-cover" /> : null}
      <div className={store.bannerUrl ? "relative bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 pt-16 text-white" : "relative p-8"}>
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <StoreImage src={store.logoUrl} className="h-14 w-14 shrink-0 rounded-2xl border-2 border-white bg-white object-cover shadow" />
          ) : null}
          <div className="min-w-0">
            <h1 className={store.bannerUrl ? "truncate text-2xl font-extrabold sm:text-3xl" : "truncate text-2xl font-extrabold text-ink sm:text-3xl"}>
              {store.name}
            </h1>
            {store.category ? <p className={store.bannerUrl ? "text-xs text-white/80" : "text-xs text-slate-500"}>{store.category}</p> : null}
          </div>
        </div>
        {store.description ? (
          <p className={store.bannerUrl ? "mt-3 line-clamp-3 max-w-lg text-sm text-white/90" : "mt-3 line-clamp-3 max-w-lg text-sm text-slate-600"}>
            {store.description}
          </p>
        ) : null}
        <Button asChild className="mt-4 rounded-full bg-cta px-6 text-xs font-bold text-white shadow-md hover:opacity-90">
          <Link href="/products">
            Shop Now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/** Contact details the store chose to show customers. */
function StoreContactCard({ store }: { store: StoreProfile }) {
  const rows = [
    store.contactEmail ? { icon: Mail, label: store.contactEmail, href: `mailto:${store.contactEmail}` } : null,
    store.contactPhone ? { icon: Phone, label: store.contactPhone, href: `tel:${store.contactPhone}` } : null,
    store.address ? { icon: MapPin, label: store.address, href: null } : null,
  ].filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-3">
      <h2 className="text-sm font-bold text-ink">About {store.name}</h2>
      {rows.length === 0 ? <p className="text-xs text-slate-500">Browse the store&apos;s products and deals.</p> : null}
      <ul className="space-y-2.5">
        {rows.map(({ icon: Icon, label, href }) => (
          <li key={label} className="flex items-start gap-2 text-xs text-slate-600">
            <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {href ? (
              <a href={href} className="break-all hover:text-brand">
                {label}
              </a>
            ) : (
              <span>{label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function Home() {
  const current = await getCurrentStore();
  const store = current.status === "found" ? current.store : null;

  return (
    <Container className="space-y-8 py-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <CategorySidebar />

        {store ? (
          <>
            <StoreHero store={store} />
            <StoreContactCard store={store} />
          </>
        ) : (
          <MarketplaceHero />
        )}
      </div>

      <TrustSignals />

      <FeaturedCategories />
      <PopularProducts />
    </Container>
  );
}

/** The platform-wide marketplace hero and promotions. */
function MarketplaceHero() {
  return (
    <>
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
    </>
  );
}

function TrustSignals() {
  return (
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
  );
}
