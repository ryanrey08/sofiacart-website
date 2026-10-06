import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/constants/site";

// Official SofiaCart platform logo (from the Canva brand design).
export function BrandLogo() {
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
