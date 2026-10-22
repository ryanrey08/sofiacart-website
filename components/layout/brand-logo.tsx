import Image from "next/image";
import Link from "next/link";

import { StoreImage } from "@/components/store/store-image";
import { siteConfig } from "@/lib/constants/site";
import { getCurrentStore } from "@/lib/store/current-store";

function SofiaCartLogo({ className }: { className: string }) {
  return (
    <Image
      src="/brand/sofiacart-logo-light.png"
      alt={`${siteConfig.appName} — ${siteConfig.tagline}`}
      width={598}
      height={174}
      priority
      className={className}
    />
  );
}

// The SofiaCart logo always; on a store subdomain it is followed by the store's own logo and name.
export async function BrandLogo() {
  const current = await getCurrentStore();

  if (current.status === "found") {
    const { store } = current;
    return (
      // On phones the group leaves room for the cart and account icons; the store name truncates.
      <Link
        href="/"
        className="flex min-w-0 max-w-[calc(100%-7rem)] items-center gap-2 sm:max-w-none sm:shrink-0 sm:gap-3"
        aria-label={`${store.name} on ${siteConfig.appName} home`}
      >
        <SofiaCartLogo className="h-7 w-auto shrink-0 sm:h-9" />
        <span aria-hidden="true" className="h-8 w-px shrink-0 bg-slate-200" />
        {store.logoUrl ? <StoreImage src={store.logoUrl} className="h-8 w-8 shrink-0 rounded-lg object-cover sm:h-10 sm:w-10" /> : null}
        <span className="min-w-0 truncate text-sm font-black text-ink sm:max-w-[12rem] sm:text-lg">{store.name}</span>
      </Link>
    );
  }

  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${siteConfig.appName} home`}>
      <SofiaCartLogo className="h-9 w-auto sm:h-11" />
    </Link>
  );
}
