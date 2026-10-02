"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ArrowLeft,
  Lock,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { sampleCart } from "@/lib/mocks/storefront";
import { formatCurrency } from "@/lib/utils/format";
import { useCartStore } from "@/stores/cart-store";

const RECOMMENDED_PRODUCTS = [
  {
    id: "rec-1",
    name: "Sports Running Shoes for Men",
    price: 3490,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "rec-2",
    name: "Women's Handbag Premium Leather",
    price: 2890,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "rec-3",
    name: "Bluetooth Headset over Ear",
    price: 2990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "rec-4",
    name: "Ergonomic Office Chair",
    price: 6490,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "rec-5",
    name: "Artificial Indoor Plant",
    price: 890,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "rec-6",
    name: "Smart Watch Fitness Tracker",
    price: 4290,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200",
  },
];

export function CartPageClient() {
  const items = useCartStore((state) => state.items);
  const currency = useCartStore((state) => state.currency);
  const replaceItems = useCartStore((state) => state.replaceItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      replaceItems({ currency: sampleCart.currency, items: sampleCart.items });
    }
  }, [items.length, replaceItems]);

  useEffect(() => {
    setSelectedItems(items.map((i) => i.productId));
  }, [items]);

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((i) => i.productId));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectedCartItems = items.filter((item) => selectedItems.includes(item.productId));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = subtotal > 0 ? 1000 : 0;
  const shipping = 0; // Free shipping
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="space-y-8 py-4">
      {/* Top Section Header & Stepper */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1E1B4B]">Shopping Cart</h1>
            <p className="text-xs text-slate-500">{items.length} items in your cart</p>
          </div>
        </div>

        {/* Checkout Stepper */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-[11px] font-bold text-white">
              1
            </span>
            <span>Cart</span>
          </div>
          <span className="text-slate-300">—</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
              2
            </span>
            <span>Checkout</span>
          </div>
          <span className="text-slate-300">—</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
              3
            </span>
            <span>Payment</span>
          </div>
          <span className="text-slate-300">—</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
              4
            </span>
            <span>Order Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Cart Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm">
            {/* Table Header Controls */}
            <div className="grid grid-cols-12 items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-4 border-b border-slate-100">
              <div className="col-span-6 flex items-center gap-3">
                <Checkbox
                  checked={selectedItems.length === items.length && items.length > 0}
                  onCheckedChange={toggleSelectAll}
                  className="rounded border-slate-300 data-[state=checked]:bg-[#5B3DF5] data-[state=checked]:border-[#5B3DF5]"
                />
                <span className="capitalize text-slate-700 text-xs">
                  Select All ({items.length} items)
                </span>
              </div>
              <div className="col-span-2 text-center hidden sm:block">Price</div>
              <div className="col-span-2 text-center hidden sm:block">Quantity</div>
              <div className="col-span-1 text-right hidden sm:block">Total</div>
              <div className="col-span-1 text-right hidden sm:block">Action</div>
            </div>

            {/* Cart Items List */}
            <CardContent className="p-0 divide-y divide-slate-100">
              {items.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  Your cart is empty.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="grid grid-cols-12 items-center py-4 gap-2 sm:gap-0">
                    {/* Checkbox + Product Info */}
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                      <Checkbox
                        checked={selectedItems.includes(item.productId)}
                        onCheckedChange={() => toggleSelectItem(item.productId)}
                        className="rounded border-slate-300 data-[state=checked]:bg-[#5B3DF5] data-[state=checked]:border-[#5B3DF5]"
                      />
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 border border-slate-100 overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={item.image || "/assets/placeholder-product.png"}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="space-y-0.5 pr-2">
                        <h3 className="text-xs sm:text-sm font-bold text-[#1E1B4B] line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          Brand: <span className="text-slate-600">Generic</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Storage: <span className="text-slate-600">Default</span>
                        </p>
                        <span className="inline-block rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 mt-1">
                          In Stock
                        </span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-4 sm:col-span-2 text-left sm:text-center">
                      <span className="text-xs font-bold text-[#1E1B4B]">
                        {formatCurrency(item.unitPrice, currency)}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-4 sm:col-span-2 flex justify-center">
                      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/50 p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-5 w-5 items-center justify-center text-slate-500 hover:text-slate-800"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-5 w-5 items-center justify-center text-slate-500 hover:text-slate-800"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="col-span-4 sm:col-span-1 text-right">
                      <span className="text-xs font-black text-[#1E1B4B]">
                        {formatCurrency(item.unitPrice * item.quantity, currency)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-span-12 sm:col-span-1 flex items-center justify-end gap-2 pt-2 sm:pt-0">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-pink-500 transition-colors"
                        title="Add to wishlist"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-200 text-xs font-bold text-[#5B3DF5] hover:bg-slate-50"
            >
              <Link href="/">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Continue Shopping
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-xs font-semibold text-slate-400 hover:text-red-500"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear Cart
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Checkout Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#1E1B4B]">Order Summary</h2>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({selectedCartItems.length} items)</span>
                <span className="font-bold text-[#1E1B4B]">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatCurrency(discount, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-[#1E1B4B]">
                  {shipping === 0 ? "₱ 0.00" : formatCurrency(shipping, currency)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Free shipping for orders ₱ 1,000 and above.
              </p>
            </div>

            <Separator className="bg-slate-100" />

            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-[#1E1B4B]">Total</span>
              <div className="text-right">
                <span className="text-xl font-black text-[#1E1B4B]">
                  {formatCurrency(total, currency)}
                </span>
                <p className="text-[9px] text-slate-400">Inclusive of VAT (if applicable)</p>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Button
              asChild
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF2A7A] to-[#FF2A7A] text-xs font-bold text-white shadow-md hover:opacity-95"
            >
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                <Lock className="h-4 w-4" /> Proceed to Checkout →
              </Link>
            </Button>

            {/* Promo Code Box */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B3DF5]">
                <Tag className="h-3.5 w-3.5" /> Have a Promo Code?
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-[#5B3DF5]"
                />
                <Button className="h-9 rounded-xl bg-[#5B3DF5] px-4 text-xs font-bold text-white hover:bg-[#482bd9]">
                  Apply
                </Button>
              </div>
            </div>
          </Card>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-4 w-4 text-[#5B3DF5] mb-1" />
              <span className="text-[10px] font-bold text-slate-800">Free Shipping</span>
              <span className="text-[8px] text-slate-400">for orders ₱1,000+</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-4 w-4 text-[#5B3DF5] mb-1" />
              <span className="text-[10px] font-bold text-slate-800">Secure Payment</span>
              <span className="text-[8px] text-slate-400">100% protected</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="h-4 w-4 text-[#5B3DF5] mb-1" />
              <span className="text-[10px] font-bold text-slate-800">Easy Returns</span>
              <span className="text-[8px] text-slate-400">7-day returns</span>
            </div>
            <div className="flex flex-col items-center">
              <Headphones className="h-4 w-4 text-[#5B3DF5] mb-1" />
              <span className="text-[10px] font-bold text-slate-800">Customer Support</span>
              <span className="text-[8px] text-slate-400">We're here to help</span>
            </div>
          </div>

          {/* Payment Method Badges */}
          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm space-y-2">
            <p className="text-xs font-bold text-[#1E1B4B]">We Accept</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-slate-100 px-2 py-1 text-[9px] font-bold text-blue-700">
                VISA
              </span>
              <span className="rounded bg-slate-100 px-2 py-1 text-[9px] font-bold text-orange-600">
                mastercard
              </span>
              <span className="rounded bg-blue-600 px-2 py-1 text-[9px] font-bold text-white">
                GCash
              </span>
              <span className="rounded bg-emerald-600 px-2 py-1 text-[9px] font-bold text-white">
                maya
              </span>
              <span className="rounded bg-blue-900 px-2 py-1 text-[9px] font-bold text-white">
                BDO
              </span>
              <span className="rounded bg-red-700 px-2 py-1 text-[9px] font-bold text-white">
                BPI
              </span>
              <span className="rounded bg-slate-200 px-2 py-1 text-[9px] font-bold text-slate-700">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: "You May Also Like" Carousel/Grid */}
      <div className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1E1B4B]">You May Also Like</h2>
          <Link href="/products" className="text-xs font-bold text-[#5B3DF5] hover:underline">
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {RECOMMENDED_PRODUCTS.map((prod) => (
            <Card
              key={prod.id}
              className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow space-y-2"
            >
              <div className="h-28 w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <h4 className="text-xs font-bold text-[#1E1B4B] line-clamp-2 h-8">
                {prod.name}
              </h4>
              <p className="text-xs font-black text-[#1E1B4B]">
                {formatCurrency(prod.price, currency)}
              </p>
              <Button
                variant="outline"
                className="w-full h-8 rounded-xl border-[#5B3DF5] text-[10px] font-bold text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white transition-colors"
              >
                <ShoppingBag className="mr-1 h-3 w-3" /> Add to Cart
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}