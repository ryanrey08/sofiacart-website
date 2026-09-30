import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderCompletePage() {
  return (
    <Container className="py-12 lg:py-16">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="space-y-5 p-8">
          <Badge className="w-fit">Order status</Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">No order has been placed</h1>
            <p className="max-w-3xl text-base text-muted-foreground">
              This route is a preview only. The backend currently exposes catalog APIs but does not support checkout or order creation.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Continue browsing</Link>
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
