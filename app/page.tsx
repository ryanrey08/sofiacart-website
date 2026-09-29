import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

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
import {
  checkoutHighlights,
  featuredProducts,
  popularProducts,
  storefrontCategories,
} from "@/lib/mocks/storefront";
import { formatCurrency } from "@/lib/utils/format";

const trustSignals = [
  {
    icon: Truck,
    title: "Fast local fulfillment",
    description: "Same-day dispatch windows for Metro Manila orders placed before cut-off.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout-ready setup",
    description: "Prepared for account, cart, and order APIs with validated form flows.",
  },
  {
    icon: Sparkles,
    title: "Curated weekly drops",
    description: "Featured and popular product layouts are ready for live catalog wiring.",
  },
] as const;

export default function Home() {
  return (
    <Container className="space-y-12 py-12 lg:space-y-16 lg:py-16">
      <section className="grid gap-8 rounded-[2rem] bg-gradient-to-br from-primary to-[#4d187f] px-6 py-10 text-primary-foreground lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-14">
        <div className="space-y-6">
          <Badge className="w-fit border-white/20 bg-white/10 text-white">SofiaCart customer storefront</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Grocery, home, and lifestyle essentials in one polished shopping experience.
            </h1>
            <p className="max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              The frontend has moved beyond scaffolding and now includes real customer-facing sections for browsing, account creation, cart review, checkout, and order completion.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link href="/register">
                Create an account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/cart">Review cart experience</Link>
            </Button>
          </div>
        </div>

        <Card className="border-white/15 bg-white/10 text-primary-foreground shadow-none backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Checkout highlights</CardTitle>
            <CardDescription className="text-primary-foreground/75">
              Reference-ready details prepared for backend integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-primary-foreground/85">
            {checkoutHighlights.map((highlight) => (
              <div key={highlight} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {highlight}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Shop by category</h2>
            <p className="text-sm text-muted-foreground">Homepage-ready category cards mapped to the SofiaCart design direction.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {storefrontCategories.map((category, index) => (
            <Card key={category.id} className="overflow-hidden border-none bg-card shadow-sm">
              <CardContent className="space-y-4 p-0">
                <div className="h-32 bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15" />
                <div className="space-y-2 px-6 pb-6">
                  <Badge variant={index % 2 === 0 ? "secondary" : "accent"}>{category.slug.replaceAll("-", " ")}</Badge>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">Prepared for catalog filtering, collection browsing, and featured merchandising.</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Featured products</h2>
          <p className="text-sm text-muted-foreground">Reusable product cards that can swap from mock data to live API responses later.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="transition-transform hover:-translate-y-1">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-40 items-center justify-center rounded-2xl bg-muted text-3xl font-semibold text-primary">
                  {product.name.charAt(0)}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{product.category?.name}</p>
                  <h3 className="text-lg font-semibold leading-tight text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(product.price, product.currency)}</p>
                    {product.compareAtPrice ? (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatCurrency(product.compareAtPrice, product.currency)}
                      </p>
                    ) : null}
                  </div>
                  <Badge>{product.rating?.toFixed(1)} ★</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-muted/35">
          <CardHeader>
            <CardTitle>Popular this week</CardTitle>
            <CardDescription>Compact list layout for bestseller, campaign, or personalized product modules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(product.price, product.currency)}</p>
                  <p className="text-xs text-muted-foreground">{product.rating?.toFixed(1)} ★ rating</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {trustSignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <Card key={signal.title}>
                <CardContent className="space-y-4 p-6">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{signal.title}</h3>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
