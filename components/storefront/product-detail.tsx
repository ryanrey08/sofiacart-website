"use client";

import { ChevronRight, Minus, PackageX, Plus, ShieldCheck, ShoppingCart, Store, Truck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginHref } from "@/components/auth/require-auth";
import { ProductImage } from "@/components/storefront/product-image";
import { ProductReviews } from "@/components/storefront/product-reviews";
import { RatingStars } from "@/components/storefront/rating-stars";
import { EmptyState, ErrorState } from "@/components/storefront/states";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart, variantLabel } from "@/hooks/use-cart";
import { useProduct } from "@/hooks/use-catalog";
import { useShippingMethods } from "@/hooks/use-checkout";
import { useHydrated, useSession } from "@/hooks/use-session";
import { ApiClientError, errorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { cn } from "@/lib/utils";
import { formatCurrency, stripHtml } from "@/lib/utils/format";
import { useCheckoutStore } from "@/stores/checkout-store";
import { toast } from "@/stores/toast-store";
import { useQueryClient } from "@tanstack/react-query";
import type { Cart, ProductVariant } from "@/types/domain";

const stockLabel = { in_stock: "In Stock", low_stock: "Low Stock", out_of_stock: "Out of Stock" } as const;

export function ProductDetail({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const { data: product, isPending: loading, isError, error, refetch } = useProduct(slug);
  const isPending = !hydrated || loading;
  const shipping = useShippingMethods();
  const addToCart = useAddToCart();
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCartItemIds = useCheckoutStore((state) => state.setCartItemIds);
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (isPending) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    if (error instanceof ApiClientError && error.status === 404) {
      return (
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="This product is no longer available or the link is incorrect."
          action={<Button asChild className="rounded-full"><Link href="/products">Browse products</Link></Button>}
        />
      );
    }
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  const item = product;
  const variants = item.variants ?? [];
  const variant: ProductVariant | null = variants.find((entry) => entry.id === variantId) ?? null;
  const needsVariant = variants.length > 0 && product.availableQuantity === 0;
  const price = variant?.price ?? product.price;
  const available = variant ? variant.availableQuantity : (product.availableQuantity ?? 0);
  const stockStatus = variant ? variant.stockStatus : (product.stockStatus ?? (product.inStock ? "in_stock" : "out_of_stock"));
  const canBuy = available > 0 && !(needsVariant && !variant);
  const images = product.images?.length ? product.images : [product.imageUrl ?? null];
  const description = stripHtml(product.fullDescription || product.description);
  const maxQuantity = Math.max(1, Math.min(available, 999));

  function add(buyNow: boolean) {
    addToCart.mutate(
      { product: item, variant, quantity: Math.min(quantity, maxQuantity) },
      {
        onSuccess: () => {
          if (!buyNow) {
            toast.success("Added to cart", item.name);
            return;
          }
          if (!isAuthenticated) {
            router.push(loginHref("/cart"));
            return;
          }
          const cart = queryClient.getQueryData<Cart>(queryKeys.cart);
          const line = cart?.items.find((item) => item.productId === item.id && item.variantId === (variant?.id ?? null));
          setCartItemIds(line ? [line.id] : null);
          router.push("/checkout");
        },
        onError: (mutationError) => toast.error("Couldn't add to cart", errorMessage(mutationError)),
      }
    );
  }

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-400">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-brand">Products</Link>
        {product.category ? (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products?category_id=${product.category.id}&category=${encodeURIComponent(product.category.name)}`} className="hover:text-brand">
              {product.category.name}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="grid gap-8 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2">
        <div className="space-y-3">
          <ProductImage src={images[imageIndex] ?? null} alt={product.name} className="aspect-square w-full rounded-2xl border border-slate-100 p-4" />
          {images.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={cn("shrink-0 rounded-xl border-2 p-0.5", index === imageIndex ? "border-brand" : "border-transparent")}
                >
                  <ProductImage src={src} alt="" className="h-16 w-16 rounded-lg" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            {product.brand ? <p className="text-xs font-bold uppercase tracking-wider text-brand">{product.brand}</p> : null}
            <h1 className="text-2xl font-black leading-tight text-ink">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <RatingStars rating={product.rating} className="[&_svg]:h-4 [&_svg]:w-4" />
              <span>{product.rating ? `${product.rating} · ${product.reviewCount} review${product.reviewCount === 1 ? "" : "s"}` : "No reviews yet"}</span>
            </div>
          </div>

          <p className="text-3xl font-black text-ink">{formatCurrency(price, product.currency)}</p>

          {product.shortDescription ? <p className="text-sm text-slate-600">{stripHtml(product.shortDescription)}</p> : null}

          {variants.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-ink">
                Options {needsVariant ? <span className="font-medium text-slate-400">(choose one)</span> : null}
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    disabled={!entry.inStock}
                    onClick={() => {
                      setVariantId(entry.id === variantId ? null : entry.id);
                      setQuantity(1);
                    }}
                    aria-pressed={entry.id === variantId}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      entry.id === variantId ? "border-brand bg-brand/5 text-brand ring-1 ring-brand" : "border-slate-200 text-slate-700 hover:border-slate-300"
                    )}
                  >
                    {variantLabel(entry) ?? `Option ${entry.id}`}
                    <span className="ml-1.5 text-slate-400">{formatCurrency(entry.price, product.currency)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
              <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-40">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-ink" aria-live="polite">{quantity}</span>
              <button type="button" aria-label="Increase quantity" disabled={quantity >= maxQuantity} onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))} className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-40">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-bold",
                stockStatus === "in_stock" && "bg-emerald-50 text-emerald-600",
                stockStatus === "low_stock" && "bg-amber-50 text-amber-700",
                stockStatus === "out_of_stock" && "bg-slate-100 text-slate-500"
              )}
            >
              {stockLabel[stockStatus]}
              {stockStatus === "low_stock" ? ` · ${available} left` : ""}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Button onClick={() => add(false)} disabled={!canBuy || addToCart.isPending} className="h-11 rounded-full bg-brand text-sm font-bold text-white hover:bg-brand/90">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Button onClick={() => add(true)} disabled={!canBuy || addToCart.isPending} className="h-11 rounded-full bg-cta text-sm font-bold text-white hover:opacity-95">
              <Zap className="h-4 w-4" /> Buy Now
            </Button>
            <div className="flex h-11 items-center justify-center rounded-full border border-slate-200 px-4">
              <WishlistButton productId={product.id} withLabel />
            </div>
          </div>
          {needsVariant && !variant ? <p className="text-xs text-slate-500">Choose an option to add this product to your cart.</p> : null}

          <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            {product.store ? (
              <p className="flex items-center gap-2">
                <Store className="h-4 w-4 text-brand" /> Sold by
                <Link href={`/products?store=${encodeURIComponent(product.store.slug)}`} className="font-bold text-ink hover:text-brand">
                  {product.store.name}
                </Link>
              </p>
            ) : null}
            {shipping.data?.shippingMethods.length ? (
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand" />
                {shipping.data.shippingMethods.map((method) => `${method.name} ${formatCurrency(method.fee, method.currency)} (${method.description})`).join(" · ")}
              </p>
            ) : null}
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" /> Prices and stock are confirmed when you place your order.
            </p>
          </div>
        </div>
      </div>

      {description || product.tags?.length || product.condition ? (
        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-ink">Product Details</h2>
          {description ? <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{description}</p> : null}
          <dl className="grid gap-2 text-xs sm:grid-cols-2">
            {product.condition ? (<div><dt className="inline font-bold text-ink">Condition: </dt><dd className="inline capitalize text-slate-600">{product.condition}</dd></div>) : null}
            {product.category ? (<div><dt className="inline font-bold text-ink">Category: </dt><dd className="inline text-slate-600">{product.category.name}</dd></div>) : null}
          </dl>
          {product.tags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">#{tag}</span>)}
            </div>
          ) : null}
        </section>
      ) : null}

      <ProductReviews slug={product.slug} />
    </div>
  );
}
