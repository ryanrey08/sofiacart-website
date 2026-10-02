import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Laptop,
  Home as HomeIcon,
  Shirt,
  Sparkles,
  ShoppingBag,
  Dumbbell,
  Baby,
  Car,
  BookOpen,
  Truck,
  ShieldCheck,
  Award,
  Headphones,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Electronics", icon: Laptop },
  { name: "Home & Living", icon: HomeIcon },
  { name: "Fashion & Apparel", icon: Shirt },
  { name: "Health & Beauty", icon: Sparkles },
  { name: "Groceries & Essentials", icon: ShoppingBag },
  { name: "Sports & Outdoors", icon: Dumbbell },
  { name: "Toys, Kids & Babies", icon: Baby },
  { name: "Automotive", icon: Car },
  { name: "Books, Stationery & Office", icon: BookOpen },
];

const trustSignals = [
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Nationwide Shipping",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "Multiple Payment Options",
  },
  {
    icon: Award,
    title: "Quality Products",
    subtitle: "Trusted Sellers",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    subtitle: "We're Here to Help",
  },
];

const featuredCategories = [
  { name: "Electronics", image: "/assets/categories/electronics.png" },
  { name: "Fashion", image: "/assets/categories/fashion.png" },
  { name: "Home & Living", image: "/assets/categories/home.png" },
  { name: "Health & Beauty", image: "/assets/categories/beauty.png" },
  { name: "Groceries", image: "/assets/categories/groceries.png" },
  { name: "Toys & Kids", image: "/assets/categories/toys.png" },
  { name: "Sports", image: "/assets/categories/sports.png" },
  { name: "Automotive", image: "/assets/categories/automotive.png" },
  { name: "Books & Office", image: "/assets/categories/books.png" },
];

const popularProducts = [
  {
    id: "1",
    name: "Laptop 15.6\" Intel i5 8GB RAM 512GB SSD",
    price: "₱ 32,990",
    rating: "4.8",
    reviews: "320",
    badge: "Best Seller",
    image: "/assets/products/laptop.png",
  },
  {
    id: "2",
    name: "Wireless Earbuds with Noise Cancellation",
    price: "₱ 2,990",
    rating: "4.7",
    reviews: "280",
    image: "/assets/products/earbuds.png",
  },
  {
    id: "3",
    name: "Sports Running Shoes for Men",
    price: "₱ 3,490",
    rating: "4.9",
    reviews: "156",
    image: "/assets/products/shoes.png",
  },
  {
    id: "4",
    name: "Air Fryer 5L Digital Touch",
    price: "₱ 4,590",
    rating: "4.8",
    reviews: "210",
    image: "/assets/products/airfryer.png",
  },
  {
    id: "5",
    name: "Women's Handbag Premium Leather",
    price: "₱ 2,890",
    rating: "4.7",
    reviews: "134",
    image: "/assets/products/handbag.png",
  },
  {
    id: "6",
    name: "Bluetooth Headset over Ear",
    price: "₱ 3,990",
    rating: "4.6",
    reviews: "198",
    image: "/assets/products/headset.png",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#1E1B4B]">
      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-8 sm:px-6">
        {/* Top Hero Layout: Categories Sidebar + Banner + Side Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Categories Left Sidebar */}
          <aside className="lg:col-span-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="rounded-xl bg-[#5B3DF5] px-4 py-3 text-white font-semibold text-sm flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span>All Categories</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
            <ul className="space-y-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li key={cat.name}>
                    <Link
                      href="#"
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#5B3DF5] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="pt-2 border-t border-slate-100 mt-2">
              <Link
                href="#"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-purple-50 hover:text-[#5B3DF5]"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="h-4 w-4 text-slate-500" />
                  <span>More Categories</span>
                </div>
                <ChevronRight className="h-3 w-3 text-slate-400" />
              </Link>
            </div>
          </aside>

          {/* Main Hero Banner */}
          <div className="lg:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFE5EC] via-[#F3E8FF] to-[#E0E7FF] p-8 flex flex-col justify-between shadow-sm border border-purple-100 min-h-[360px]">
            <div className="max-w-xs space-y-3 z-10">
              <h1 className="text-3xl font-extrabold text-[#110C3B] leading-tight">
                Shop Smarter <br />
                <span className="text-[#110C3B]">Live Better</span>
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Discover great products, amazing deals and everything you need in one cart.
              </p>
              <Button className="mt-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF2A7A] px-6 text-xs font-bold text-white shadow-md hover:opacity-90">
                Shop Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
            {/* Banner Illustration Image */}
            <img
              src="/assets/banners/shopping-cart-hero.png"
              alt="Shopping Cart Promotion"
              className="absolute right-2 bottom-0 h-72 w-auto object-contain pointer-events-none drop-shadow-lg"
            />
          </div>

          {/* Side Promo Cards Right */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Promo Card 1 */}
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] p-5 flex items-center justify-between relative overflow-hidden shadow-sm">
              <div className="space-y-2 max-w-[140px] z-10">
                <h3 className="text-sm font-bold text-[#110C3B] leading-snug">
                  Best Deals on Electronics
                </h3>
                <p className="text-[11px] font-semibold text-slate-600">Up to 50% Off</p>
                <Button size="sm" className="h-7 rounded-full bg-[#5B3DF5] px-3 text-[10px] font-bold text-white">
                  Shop Now <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <img
                src="/assets/banners/electronics-promo.png"
                alt="Electronics Deals"
                className="h-24 w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Promo Card 2 */}
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA] p-5 flex items-center justify-between relative overflow-hidden shadow-sm">
              <div className="space-y-2 max-w-[140px] z-10">
                <h3 className="text-sm font-bold text-[#110C3B] leading-snug">
                  Home Essentials For a Better Living
                </h3>
                <Button size="sm" className="h-7 rounded-full bg-[#FF6B00] px-3 text-[10px] font-bold text-white">
                  Shop Now <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <img
                src="/assets/banners/home-promo.png"
                alt="Home Essentials"
                className="h-24 w-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Trust Signals Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
          {trustSignals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div key={signal.title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[#5B3DF5]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#110C3B]">{signal.title}</h4>
                  <p className="text-[10px] text-slate-500">{signal.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#110C3B]">Featured Categories</h2>
            <Link href="#" className="text-xs font-semibold text-[#5B3DF5] flex items-center gap-1 hover:underline">
              View All Categories <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {featuredCategories.map((item) => (
              <Link
                key={item.name}
                href="#"
                className="group flex flex-col items-center justify-center rounded-2xl bg-white p-3 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 p-2 mb-2 group-hover:bg-purple-50">
                  <img src={item.image} alt={item.name} className="h-10 w-10 object-contain" />
                </div>
                <span className="text-[11px] font-semibold text-center text-slate-700 leading-tight">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#110C3B]">Popular Products</h2>
            <Link href="#" className="text-xs font-semibold text-[#5B3DF5] flex items-center gap-1 hover:underline">
              View All Products <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {popularProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-3 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  {/* Top Badges & Wishlist */}
                  <div className="flex items-center justify-between mb-2">
                    {product.badge ? (
                      <Badge className="bg-[#FF2A7A] text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white">
                        {product.badge}
                      </Badge>
                    ) : (
                      <span />
                    )}
                    <button className="text-slate-400 hover:text-[#FF2A7A]">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="flex h-28 items-center justify-center p-2 mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mb-1">
                    <span className="text-amber-500">★★★★☆</span>
                    <span>{product.rating} ({product.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug mb-2">
                    {product.name}
                  </h3>
                </div>

                <div>
                  {/* Price */}
                  <p className="text-sm font-extrabold text-[#110C3B] mb-2">{product.price}</p>

                  {/* Add to Cart Button */}
                  <Button
                    variant="outline"
                    className="w-full h-8 rounded-full border-purple-200 text-xs font-semibold text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white transition-colors"
                  >
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}