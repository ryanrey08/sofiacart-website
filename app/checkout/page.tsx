import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, MapPin, Truck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  paymentMethods,
  sampleAddress,
  sampleCart,
  shippingMethods,
} from "@/lib/mocks/storefront";
import { formatCurrency } from "@/lib/utils/format";

const checkoutSteps = ["Address", "Delivery", "Payment", "Review"] as const;

export default function CheckoutPage() {
  return (
    <Container className="space-y-8 py-12 lg:py-16">
      <div className="space-y-4">
        <Badge variant="accent">Checkout</Badge>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Complete your order with confidence</h1>
          <p className="max-w-3xl text-base text-muted-foreground">
            The checkout route now includes actual shipping, delivery, payment, and order review sections mapped to the SofiaCart customer flow.
          </p>
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl bg-muted/40 p-2 md:grid-cols-4">
        {checkoutSteps.map((step, index) => (
          <div
            key={step}
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              index === checkoutSteps.length - 1
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground"
            }`}
          >
            {index + 1}. {step}
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="size-5 text-primary" /> Shipping details</CardTitle>
              <CardDescription>Default delivery address prepared for account and checkout API wiring.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{sampleAddress.recipientName}</p>
              <p>{sampleAddress.line1}</p>
              <p>{sampleAddress.city}, {sampleAddress.state} {sampleAddress.postalCode}</p>
              <p>{sampleAddress.country}</p>
              <p>{sampleAddress.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Truck className="size-5 text-primary" /> Delivery method</CardTitle>
              <CardDescription>Select the fulfillment option that best fits the order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shippingMethods.map((method, index) => (
                <div key={method.id} className={`rounded-xl border p-4 ${index === 0 ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{method.title}</p>
                      <p className="text-sm text-muted-foreground">{method.eta}</p>
                    </div>
                    <p className="font-semibold text-foreground">{method.price === 0 ? "Free" : formatCurrency(method.price)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="size-5 text-primary" /> Payment method</CardTitle>
              <CardDescription>Ready for future gateway and cash-on-delivery integration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={method.id} className={`rounded-xl border p-4 ${index === 0 ? "border-primary bg-primary/5" : "border-border"}`}>
                  <p className="font-medium text-foreground">{method.title}</p>
                  <p className="text-sm text-muted-foreground">{method.details}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order review</CardTitle>
              <CardDescription>Summary of items and total before confirming checkout.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {sampleCart.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">{formatCurrency(item.unitPrice * item.quantity, item.currency)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(sampleCart.subtotal)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatCurrency(sampleCart.shipping)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(sampleCart.tax)}</span></div>
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold"><span>Total</span><span>{formatCurrency(sampleCart.total)}</span></div>
              <Button asChild className="w-full" size="lg">
                <Link href="/order/complete">
                  Place order
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-secondary/30 bg-secondary/10">
            <CardContent className="flex items-start gap-3 p-5 text-sm text-secondary-foreground">
              <CheckCircle2 className="mt-0.5 size-4" />
              <p>Once backend wiring is added, this summary can submit directly to the checkout order endpoint without changing the layout structure.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
