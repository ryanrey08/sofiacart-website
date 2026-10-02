import Link from "next/link";

import { siteConfig } from "@/lib/constants/site";

export function BrandLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${siteConfig.appName} home`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-pink via-brand-orange to-brand text-white shadow-md">
        <span className="text-xl font-black italic">S</span>
      </div>
      <div className="hidden sm:block">
        <div className="text-xl font-extrabold tracking-tight text-[#2D157B]">
          Sofia<span className="text-brand-orange">Cart</span>
        </div>
        <p className="text-[9px] font-medium tracking-wider text-slate-500">— {siteConfig.tagline} —</p>
      </div>
    </Link>
  );
}
