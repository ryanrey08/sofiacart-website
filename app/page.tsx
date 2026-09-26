import Link from "next/link";
import { ArrowRight, CreditCard, LayoutGrid, ShoppingBag, UserRoundPlus } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiEndpoints } from "@/lib/api/endpoints";
import { env } from "@/lib/config/env";

const foundationCards = [
  {
    title: "Registration",
    description: "Personal info, security, shipping address, and terms acceptance scaffolding.",
    href: "/register",
    icon: UserRoundPlus,
  },
  {
    title: "Homepage",
    description: "Header, categories, featured products, and popular products section shell.",
    href: "/",
    icon: LayoutGrid,
  },
  {
    title: "Cart",
    description: "Cart list, order summary, and checkout progression shell.",
    href: "/cart",
    icon: ShoppingBag,
  },
  {
    title: "Checkout",
    description: "Shipping, payment, and order completion route structure.",
    href: "/checkout",
    icon: CreditCard,
  },
] as const;

export default function Home() {
  return (
    <Container className="space-y-10 py-12 lg:space-y-14 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-5">
          <Badge variant="secondary">Phase 1 & 2 foundation</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              SofiaCart now has a production-ready frontend foundation.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              This starter focuses on reusable UI, route structure, client state, API integration surfaces, and layout primitives so product pages can be implemented cleanly in the next phase.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register">
                Review flow shells
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/checkout">Inspect checkout structure</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Environment & API baseline</CardTitle>
            <CardDescription>Prepared for backend integration in Phase 3.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">API base URL</p>
              <p>{env.NEXT_PUBLIC_API_BASE_URL}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Planned auth endpoints</p>
              <code className="block rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                {Object.values(apiEndpoints.auth).join("\n")}
              </code>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {foundationCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title} className="transition-transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="pt-4">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="px-0 text-primary hover:bg-transparent">
                  <Link href={card.href}>
                    Open route
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </Container>
  );
}
