import { Container } from "@/components/layout/container";
import { ProductDetail } from "@/components/storefront/product-detail";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Container className="py-6">
      <ProductDetail slug={slug} />
    </Container>
  );
}
