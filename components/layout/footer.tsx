import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Container } from "@/components/layout/container";
import { footerNavigation } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <Container className="grid gap-6 py-10 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div className="space-y-3">
          <BrandLogo />
          <p className="max-w-xl text-xs text-slate-500">{siteConfig.description}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          {footerNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-xs font-semibold text-slate-600 hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
      <div className="border-t border-slate-100 py-4 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} {siteConfig.appName}. All rights reserved.
      </div>
    </footer>
  );
}
