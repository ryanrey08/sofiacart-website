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
import { CatalogSections } from "@/components/storefront/catalog-sections";

const trustSignals = [
  {
    icon: Truck,
    title: "Product availability",
    description: "Stock availability is included in the public catalog response.",
  },
  {
    icon: ShieldCheck,
    title: "Verified catalog",
    description: "Browse categories and products returned by the public catalog API.",
  },
  {
    icon: Sparkles,
    title: "Live search and sorting",
    description: "Search, category filters, sorting, and pagination use supported catalog parameters.",
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
              Browse verified products and categories from the live SofiaCart catalog.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link href="#catalog">
                Browse catalog
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href="/cart">View cart preview</Link>
            </Button>
          </div>
        </div>

        <Card className="border-white/15 bg-white/10 text-primary-foreground shadow-none backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Currently available</CardTitle>
            <CardDescription className="text-primary-foreground/75">
              Only the implemented public catalog APIs are connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-primary-foreground/85">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Categories and products</div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Search, filters, sort, and pagination</div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Registration, cart, and checkout are not available</div>
          </CardContent>
        </Card>
      </section>

      <CatalogSections />

      <section className="grid gap-4 md:grid-cols-3">
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
      </section>
    </Container>
  );
}
