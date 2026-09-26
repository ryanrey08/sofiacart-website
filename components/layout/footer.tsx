import Link from "next/link";

import { Container } from "@/components/layout/container";
import { footerNavigation } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.5fr_1fr] md:items-center">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{siteConfig.appName}</p>
          <p className="max-w-2xl text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          {footerNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-primary">
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
