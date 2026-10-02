"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { loginHref } from "@/components/auth/require-auth";
import { errorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useToggleWishlist, useWishlist } from "@/hooks/use-cart";
import { toast } from "@/stores/toast-store";

export function WishlistButton({ productId, className, withLabel = false }: { productId: number; className?: string; withLabel?: boolean }) {
  const wishlist = useWishlist();
  const toggle = useToggleWishlist();
  const router = useRouter();
  const pathname = usePathname();
  // isAuthenticated is false until hydration, so the first render matches the server HTML.
  const saved = wishlist.isAuthenticated && wishlist.has(productId);

  function onClick() {
    if (!wishlist.isAuthenticated) {
      router.push(loginHref(pathname));
      return;
    }

    toggle.mutate(
      { productId, saved },
      {
        onSuccess: (added) => toast.success(added ? "Added to your wishlist" : "Removed from your wishlist"),
        onError: (error) => toast.error("Wishlist not updated", errorMessage(error)),
      }
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={toggle.isPending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors disabled:opacity-50",
        saved ? "text-brand-pink" : "text-slate-400 hover:text-brand-pink",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current")} />
      {withLabel ? <span className="text-xs font-semibold">{saved ? "Saved" : "Wishlist"}</span> : null}
    </button>
  );
}
