"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/components/storefront/product-image";
import { RatingStars } from "@/components/storefront/rating-stars";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/format";
import { useAddToCart } from "@/hooks/use-cart";
import { toast } from "@/stores/toast-store";
import type { Product } from "@/types/domain";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart();
  const href = `/products/${product.slug}`;

  function add() {
    addToCart.mutate(
      { product, quantity: 1 },
      {
        onSuccess: () => toast.success("Added to cart", product.name),
        onError: (error) => toast.error("Couldn't add to cart", errorMessage(error)),
      }
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div className="mb-1 flex items-center justify-between">
          {product.stockStatus === "low_stock" ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">Few left</span>
          ) : product.inStock ? (
            <span />
          ) : (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">Out of stock</span>
          )}
          <WishlistButton productId={product.id} />
        </div>

        <Link href={href} className="block">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="mb-2 h-28 rounded-xl"
            imgClassName="transition-transform group-hover:scale-105"
          />
          <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
            <RatingStars rating={product.rating} />
            <span className="whitespace-nowrap">{product.rating ? `${product.rating} (${product.reviewCount ?? 0})` : "(0)"}</span>
          </div>
          <h3 className="mb-2 line-clamp-2 text-xs font-bold leading-snug text-slate-800 group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
      </div>

      <div>
        <p className="mb-2 text-sm font-extrabold text-ink">{formatCurrency(product.price, product.currency)}</p>
        <Button
          variant="outline"
          onClick={add}
          disabled={!product.inStock || addToCart.isPending}
          className="h-8 w-full rounded-full border-brand/30 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {product.inStock ? "Add to Cart" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
}
