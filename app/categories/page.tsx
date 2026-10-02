import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CategoryDirectory } from "@/components/storefront/category-directory";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <Container className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-black text-ink">All Categories</h1>
        <p className="text-xs text-slate-500">Browse every category from SofiaCart stores.</p>
      </div>
      <CategoryDirectory />
    </Container>
  );
}
