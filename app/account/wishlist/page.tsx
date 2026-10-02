import type { Metadata } from "next";

import { WishlistPage } from "@/components/account/wishlist-page";

export const metadata: Metadata = { title: "Wishlist" };

export default function AccountWishlistPage() {
  return <WishlistPage />;
}
