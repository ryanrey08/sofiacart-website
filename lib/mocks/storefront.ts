import type { Address, Cart, CartItem, Category, Order, Product } from "@/types/domain";

export const storefrontCategories: Category[] = [
  { id: 1, name: "Fresh Picks", slug: "fresh-picks" },
  { id: 2, name: "Pantry Staples", slug: "pantry-staples" },
  { id: 3, name: "Home Care", slug: "home-care" },
  { id: 4, name: "Health & Beauty", slug: "health-beauty" },
];

export const featuredProducts: Product[] = [
  {
    id: 101,
    name: "Sofia Signature Coffee Beans",
    slug: "sofia-signature-coffee-beans",
    description: "Medium roast whole beans with caramel and cacao notes.",
    price: 549,
    compareAtPrice: 629,
    currency: "PHP",
    category: storefrontCategories[1],
    inStock: true,
    rating: 4.8,
  },
  {
    id: 102,
    name: "Daily Glow Vitamin Serum",
    slug: "daily-glow-vitamin-serum",
    description: "Brightening skincare serum for morning and evening routines.",
    price: 799,
    currency: "PHP",
    category: storefrontCategories[3],
    inStock: true,
    rating: 4.9,
  },
  {
    id: 103,
    name: "Crisp Garden Salad Kit",
    slug: "crisp-garden-salad-kit",
    description: "Fresh greens with house dressing and crunchy toppings.",
    price: 259,
    currency: "PHP",
    category: storefrontCategories[0],
    inStock: true,
    rating: 4.7,
  },
  {
    id: 104,
    name: "Lavender Linen Spray",
    slug: "lavender-linen-spray",
    description: "Refreshing room and fabric mist for a calm home atmosphere.",
    price: 349,
    currency: "PHP",
    category: storefrontCategories[2],
    inStock: true,
    rating: 4.6,
  },
];

export const popularProducts: Product[] = [
  {
    id: 105,
    name: "Classic Sourdough Loaf",
    slug: "classic-sourdough-loaf",
    description: "Slow-fermented artisan loaf baked fresh every morning.",
    price: 180,
    currency: "PHP",
    category: storefrontCategories[0],
    inStock: true,
    rating: 4.8,
  },
  {
    id: 106,
    name: "Kitchen Surface Cleaner",
    slug: "kitchen-surface-cleaner",
    description: "Plant-based cleaning spray with citrus finish.",
    price: 229,
    currency: "PHP",
    category: storefrontCategories[2],
    inStock: true,
    rating: 4.5,
  },
  {
    id: 107,
    name: "Trail Mix Variety Pack",
    slug: "trail-mix-variety-pack",
    description: "Ready-to-go snacks for workdays and weekend trips.",
    price: 315,
    currency: "PHP",
    category: storefrontCategories[1],
    inStock: true,
    rating: 4.7,
  },
];

export const sampleCartItems: CartItem[] = [
  {
    id: 1,
    productId: 101,
    name: "Sofia Signature Coffee Beans",
    slug: "sofia-signature-coffee-beans",
    unitPrice: 549,
    quantity: 1,
    currency: "PHP",
  },
  {
    id: 2,
    productId: 103,
    name: "Crisp Garden Salad Kit",
    slug: "crisp-garden-salad-kit",
    unitPrice: 259,
    quantity: 2,
    currency: "PHP",
  },
  {
    id: 3,
    productId: 104,
    name: "Lavender Linen Spray",
    slug: "lavender-linen-spray",
    unitPrice: 349,
    quantity: 1,
    currency: "PHP",
  },
];

const subtotal = sampleCartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
const shipping = 120;
const tax = subtotal * 0.08;

export const sampleCart: Cart = {
  items: sampleCartItems,
  subtotal,
  shipping,
  tax,
  total: subtotal + shipping + tax,
  currency: "PHP",
};

export const sampleAddress: Address = {
  id: 1,
  label: "Home",
  recipientName: "Sofia Santos",
  phone: "+63 917 555 0101",
  line1: "32 Sampaguita Street",
  city: "Quezon City",
  state: "Metro Manila",
  postalCode: "1100",
  country: "Philippines",
  isDefault: true,
};

export const checkoutHighlights = [
  "Free delivery on orders above ₱1,500",
  "Cashless payment available on delivery and pickup",
  "Order cut-off for same-day dispatch: 3:00 PM",
] as const;

export const shippingMethods = [
  { id: "standard", title: "Standard Delivery", eta: "Tomorrow, 9 AM - 1 PM", price: 120 },
  { id: "express", title: "Express Delivery", eta: "Today, within 3 hours", price: 220 },
  { id: "pickup", title: "Store Pickup", eta: "Ready in 45 minutes", price: 0 },
] as const;

export const paymentMethods = [
  { id: "gcash", title: "GCash", details: "Pay instantly with your mobile wallet." },
  { id: "card", title: "Credit / Debit Card", details: "Visa, Mastercard, and JCB accepted." },
  { id: "cod", title: "Cash on Delivery", details: "Available for Metro Manila addresses." },
] as const;

export const orderTimeline = [
  { title: "Order confirmed", description: "Your order has been received and payment was approved." },
  { title: "Packing in progress", description: "Store team is preparing your items for dispatch." },
  { title: "Out for delivery", description: "Courier is assigned and en route to your address." },
  { title: "Delivered", description: "Estimated arrival tomorrow before 1:00 PM." },
] as const;

export const latestOrder: Order = {
  id: 9001,
  orderNumber: "SC-2026-0901",
  status: "processing",
  items: sampleCartItems,
  total: sampleCart.total,
  currency: "PHP",
  shippingAddress: sampleAddress,
  placedAt: "2026-09-29T08:00:00.000Z",
};
