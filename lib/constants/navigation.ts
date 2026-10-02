import {
  Bell,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  ReceiptText,
  RotateCcw,
  Settings,
  Star,
  TicketPercent,
} from "lucide-react";

/** Customer account sidebar (Canva "My Orders" screen). */
export const accountNavigation = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "My Addresses", icon: MapPin },
  { href: "/account/payments", label: "Payments", icon: ReceiptText },
  { href: "/account/returns", label: "Returns & Refunds", icon: RotateCcw },
  { href: "/account/reviews", label: "My Reviews", icon: Star },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/vouchers", label: "Vouchers & Promotions", icon: TicketPercent },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/settings", label: "Account Settings", icon: Settings },
] as const;

export const footerNavigation = [
  { href: "/products", label: "Shop All" },
  { href: "/categories", label: "Categories" },
  { href: "/vouchers", label: "Vouchers" },
  { href: "/cart", label: "Cart" },
  { href: "/account/orders", label: "My Orders" },
] as const;
