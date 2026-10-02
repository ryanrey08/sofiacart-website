import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import { ProductListing } from "@/components/storefront/product-listing";
import { ProductGridSkeleton } from "@/components/storefront/states";

export const metadata: Metadata = { title: "Shop" };

export default function ProductsPage() {
  return (
    <Container className="py-6">
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductListing />
      </Suspense>
    </Container>
  );
}
