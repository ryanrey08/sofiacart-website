import { Store } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/lib/constants/site";

/**
 * Shown on a store subdomain that has no live store behind it: never registered, or not (or no
 * longer) approved. Deliberately says nothing about which of these it is.
 */
export function StoreNotFound({ slug }: { slug: string }) {
  const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <Image src="/brand/sofiacart-logo-light.png" alt={siteConfig.appName} width={598} height={174} priority className="mb-10 h-10 w-auto" />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Store aria-hidden="true" className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-black text-ink">Store not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        There is no store at <span className="font-semibold text-slate-700">{slug}</span> right now. Check the address, or the store may
        not be open yet.
      </p>
      {platformUrl ? (
        <a href={platformUrl} className="mt-6 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-bold text-white hover:opacity-90">
          Go to {siteConfig.appName}
        </a>
      ) : null}
    </main>
  );
}
