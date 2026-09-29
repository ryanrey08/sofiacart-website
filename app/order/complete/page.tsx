import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { latestOrder, orderTimeline } from "@/lib/mocks/storefront";
import { formatCurrency, formatShortDate } from "@/lib/utils/format";

const timelineIcons = [CheckCircle2, PackageCheck, Truck, Clock3] as const;

export default function OrderCompletePage() {
  return (
    <Container className="space-y-8 py-12 lg:py-16">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="space-y-5 p-8">
          <Badge className="w-fit">Order complete</Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Thanks for shopping with SofiaCart</h1>
            <p className="max-w-3xl text-base text-muted-foreground">
              Your customer order completion route is now built with real summary sections instead of placeholders.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-background p-4">
              <p className="text-sm text-muted-foreground">Order number</p>
              <p className="text-lg font-semibold text-foreground">{latestOrder.orderNumber}</p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-sm text-muted-foreground">Placed on</p>
              <p className="text-lg font-semibold text-foreground">{formatShortDate(latestOrder.placedAt)}</p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-sm text-muted-foreground">Order total</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(latestOrder.total, latestOrder.currency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
            <CardDescription>Structured for eventual live order tracking updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {orderTimeline.map((step, index) => {
              const Icon = timelineIcons[index];

              return (
                <div key={step.title} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{latestOrder.shippingAddress.recipientName}</p>
              <p>{latestOrder.shippingAddress.line1}</p>
              <p>
                {latestOrder.shippingAddress.city}, {latestOrder.shippingAddress.state} {latestOrder.shippingAddress.postalCode}
              </p>
              <p>{latestOrder.shippingAddress.country}</p>
              <p>{latestOrder.shippingAddress.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next actions</CardTitle>
              <CardDescription>Call-to-action blocks for the post-purchase customer experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  Continue shopping
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/cart">Revisit cart flow</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
