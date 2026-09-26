import Link from "next/link";
import { ShoppingCart, UserRound } from "lucide-react";

import { Navigation } from "@/components/layout/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/constants/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              S
            </span>
            <div>
              <p className="font-semibold text-foreground">{siteConfig.appName}</p>
              <p className="text-xs text-muted-foreground">Design system foundation</p>
            </div>
          </Link>
          <Navigation className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" asChild>
            <Link href="/register">
              <UserRound className="size-4" />
              Account
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild className="relative" aria-label="Shopping cart">
            <Link href="/cart">
              <ShoppingCart className="size-4" />
              <Badge className="absolute -right-2 -top-2 size-5 justify-center rounded-full px-0 py-0 text-[10px]">
                0
              </Badge>
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
