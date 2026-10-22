import Image from "next/image";
import Link from "next/link";

import { StoreImage } from "@/components/store/store-image";
import { siteConfig } from "@/lib/constants/site";
import { getCurrentStore } from "@/lib/store/current-store";

// The store's own logo and name on a store subdomain; the SofiaCart logo on the marketplace.
export async function BrandLogo() {
  const current = await getCurrentStore();

  if (current.status === "found") {
    const { store } = current;
    return (
      <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label={`${store.name} home`}>
        {store.logoUrl ? <StoreImage src={store.logoUrl} className="h-9 w-9 shrink-0 rounded-xl object-cover sm:h-11 sm:w-11" /> : null}
        <span className="max-w-[12rem] truncate text-base font-black text-ink sm:text-lg">{store.name}</span>
      </Link>
    );
  }

  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${siteConfig.appName} home`}>
      <Image
        src="/brand/sofiacart-logo-light.png"
        alt={`${siteConfig.appName} — ${siteConfig.tagline}`}
        width={598}
        height={174}
        priority
        className="h-9 w-auto sm:h-11"
      />
    </Link>
  );
}
