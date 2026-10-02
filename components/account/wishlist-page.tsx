"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { ProductImage } from "@/components/storefront/product-image";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { useAddToCart, useToggleWishlist, useWishlist } from "@/hooks/use-cart";
import { errorMessage } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";

export function WishlistPage() {
  const wishlist = useWishlist();
  const toggle = useToggleWishlist();
  const addToCart = useAddToCart();

  return (
    <>
      <AccountPageHeader icon={Heart} title="Wishlist" description="Products you saved for later." />
      {wishlist.isPending ? (
        <ProductGridSkeleton count={4} className="lg:grid-cols-4" />
      ) : wishlist.isError ? (
        <ErrorState error={wishlist.error} onRetry={() => void wishlist.refetch()} />
      ) : wishlist.data.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          action={<Button asChild className="rounded-full bg-brand"><Link href="/products">Browse Products</Link></Button>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {wishlist.data.map((item) => (
            <div key={item.id} className="flex flex-col justify-between gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              {item.slug && item.available ? (
                <Link href={`/products/${item.slug}`} className="space-y-2">
                  <ProductImage src={item.imageUrl} alt={item.name ?? "Product"} className="h-28 rounded-xl" />
                  <p className="line-clamp-2 text-xs font-bold text-ink hover:text-brand">{item.name}</p>
                </Link>
              ) : (
                <div className="space-y-2 opacity-60">
                  <ProductImage src={item.imageUrl} alt={item.name ?? "Product"} className="h-28 rounded-xl" />
                  <p className="line-clamp-2 text-xs font-bold text-ink">{item.name ?? "Unavailable product"}</p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-ink">{formatCurrency(item.price, item.currency)}</p>
                  {!item.available ? <span className="text-[10px] font-bold text-slate-400">Unavailable</span> : !item.inStock ? <span className="text-[10px] font-bold text-amber-600">Out of stock</span> : null}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={!item.inStock || addToCart.isPending}
                    onClick={() =>
                      addToCart.mutate(
                        { product: { id: item.productId, name: item.name ?? "", slug: item.slug ?? "", imageUrl: item.imageUrl, price: item.price, currency: item.currency } },
                        {
                          onSuccess: () => toast.success("Added to cart", item.name ?? undefined),
                          onError: (error) => toast.error("Couldn't add to cart", errorMessage(error)),
                        }
                      )
                    }
                    className="h-8 flex-1 rounded-full border-brand/30 text-[11px] font-semibold text-brand hover:bg-brand hover:text-white"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${item.name} from wishlist`}
                    disabled={toggle.isPending}
                    onClick={() =>
                      toggle.mutate({ productId: item.productId, saved: true }, { onError: (error) => toast.error("Couldn't remove item", errorMessage(error)) })
                    }
                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
