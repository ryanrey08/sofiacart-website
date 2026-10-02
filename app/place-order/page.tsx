"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Lock,
  Search,
  Heart,
  ShoppingCart,
  User,
  Pencil,
  MapPin,
  Truck,
  CreditCard,
  FileText,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  ChevronDown,
  LockKeyhole,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Sample cart items matching the mockup exactly
const reviewItems = [
  {
    id: "1",
    name: "Laptop 15.6\" Intel i5 8GB RAM 512GB SSD",
    brand: "Lenovo",
    color: "Gray",
    inStock: true,
    price: 32990,
    quantity: 1,
    image: "/assets/laptop.png", // replace with your image path or external URL
  },
  {
    id: "2",
    name: "Wireless Earbuds with Noise Cancellation",
    brand: "Anker",
    color: "White",
    inStock: true,
    price: 2990,
    quantity: 1,
    image: "/assets/earbuds.png", // replace with your image path or external URL
  },
  {
    id: "3",
    name: "Air Fryer 5L Digital Touch",
    brand: "Philips",
    color: "Black",
    inStock: true,
    price: 4590,
    quantity: 1,
    image: "/assets/airfryer.png", // replace with your image path or external URL
  },
];

export default function OrderReviewPage() {
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = 40570;
  const discount = 1000;
  const shippingFee = 100;
  const total = subtotal - discount + shippingFee;

  const formatPeso = (val: number) =>
    `₱ ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 font-sans pb-16">
      {/* ----------------- MAIN CONTENT CONTAINER ----------------- */}
      <Container className="max-w-7xl pt-6 space-y-6">
        {/* STEPPER BAR */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-semibold py-2 overflow-x-auto">
          {/* Step 1: Cart */}
          <div className="flex items-center gap-2 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">Cart</span>
          </div>

          <div className="h-[2px] w-8 sm:w-16 bg-[#5B3DF5]/30" />

          {/* Step 2: Checkout */}
          <div className="flex items-center gap-2 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white font-bold text-[11px]">
              2
            </span>
            <span className="font-semibold">Checkout</span>
          </div>

          <div className="h-[2px] w-8 sm:w-16 bg-[#5B3DF5]/30" />

          {/* Step 3: Payment */}
          <div className="flex items-center gap-2 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">Payment</span>
          </div>

          <div className="h-[2px] w-8 sm:w-16 bg-[#5B3DF5]/30" />

          {/* Step 4: Place Order (Active / Current Step) */}
          <div className="flex items-center gap-2 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white font-bold text-[11px]">
              4
            </span>
            <span className="font-bold text-[#1E1B4B]">Place Order</span>
          </div>

          <div className="h-[2px] w-8 sm:w-16 bg-slate-200" />

          {/* Step 5: Order Complete */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-[11px]">
              5
            </span>
            <span>Order Complete</span>
          </div>
        </div>

        {/* HEADER TITLE */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1E1B4B] tracking-tight">Review Your Order</h1>
            <p className="text-xs text-slate-500 font-medium">
              Please review your details before placing your order.
            </p>
          </div>
        </div>

        {/* 2 COLUMN LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: Details & Items (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 2x2 Grid for Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Shipping Information Card */}
              <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B4B]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <h2>Shipping Information</h2>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-[#5B3DF5] hover:underline">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                </div>
                <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                  <p className="font-bold text-[#1E1B4B]">Juan Dela Cruz</p>
                  <p>123 Rizal Street, Barangay San Isidro</p>
                  <p>Makati City, Metro Manila 1200</p>
                  <p>Philippines</p>
                  <p className="pt-1">Phone: +63 912 345 6789</p>
                  <p>Email: juan.delacruz@email.com</p>
                </div>
              </Card>

              {/* Delivery Method Card */}
              <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B4B]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                      <Truck className="h-4 w-4" />
                    </div>
                    <h2>Delivery Method</h2>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-[#5B3DF5] hover:underline">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5] border border-purple-100">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#1E1B4B]">Standard Delivery</p>
                    <p className="text-[11px] text-slate-400">3 - 5 business days</p>
                    <p className="font-bold text-[#1E1B4B] pt-0.5">₱ 100.00</p>
                  </div>
                </div>
              </Card>

              {/* Payment Method Card */}
              <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B4B]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <h2>Payment Method</h2>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-[#5B3DF5] hover:underline">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-8 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-[10px] shadow-sm">
                    <span className="text-red-500 font-extrabold text-xs">●</span>
                    <span className="text-amber-400 font-extrabold text-xs -ml-1">●</span>
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#1E1B4B]">Credit / Debit Card</p>
                    <p className="text-[11px] text-slate-400">**** **** **** 1234</p>
                    <p className="text-[10px] text-slate-400">Expires 10/28</p>
                  </div>
                </div>
              </Card>

              {/* Billing Information Card */}
              <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B4B]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <h2>Billing Information</h2>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-[#5B3DF5] hover:underline">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onCheckedChange={(c) => setSameAsShipping(!!c)}
                    className="rounded border-slate-300 data-[state=checked]:bg-[#5B3DF5] data-[state=checked]:border-[#5B3DF5]"
                  />
                  <label
                    htmlFor="sameAsShipping"
                    className="text-xs text-slate-600 font-medium cursor-pointer"
                  >
                    Same as shipping address
                  </label>
                </div>
              </Card>
            </div>

            {/* ORDER ITEMS TABLE CARD */}
            <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B4B]">
                  <ShoppingCart className="h-4 w-4 text-[#5B3DF5]" />
                  <h2>Order Items <span className="text-slate-400 font-normal">({reviewItems.length} items)</span></h2>
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold text-[#5B3DF5] hover:underline">
                  <Pencil className="h-3 w-3" /> Edit Cart
                </button>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100">
                      <th className="pb-2 font-bold uppercase tracking-wider">Product</th>
                      <th className="pb-2 text-right font-bold uppercase tracking-wider">Price</th>
                      <th className="pb-2 text-center font-bold uppercase tracking-wider">Quantity</th>
                      <th className="pb-2 text-right font-bold uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {reviewItems.map((item) => (
                      <tr key={item.id} className="group">
                        {/* Product Info */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  // Fallback placeholder if image not found
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                            <div className="space-y-0.5">
                              <h3 className="font-bold text-[#1E1B4B] group-hover:text-[#5B3DF5] transition-colors line-clamp-1">
                                {item.name}
                              </h3>
                              <p className="text-[11px] text-slate-400">
                                Brand: <span className="text-slate-600">{item.brand}</span> | Color:{" "}
                                <span className="text-slate-600">{item.color}</span>
                              </p>
                              {item.inStock && (
                                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                                  In Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 text-right font-bold text-[#1E1B4B]">
                          {formatPeso(item.price)}
                        </td>

                        {/* Quantity */}
                        <td className="py-4 text-center font-semibold text-slate-600">
                          {item.quantity}
                        </td>

                        {/* Total */}
                        <td className="py-4 text-right font-bold text-[#1E1B4B]">
                          {formatPeso(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Order Summary (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-base font-black text-[#1E1B4B] border-b border-slate-100 pb-3">
                <FileText className="h-5 w-5 text-[#5B3DF5]" />
                <h2>Order Summary</h2>
              </div>

              {/* Subtotal / Fees Breakdown */}
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({reviewItems.length} items)</span>
                  <span className="font-bold text-[#1E1B4B]">{formatPeso(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>- {formatPeso(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-[#1E1B4B]">{formatPeso(shippingFee)}</span>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Grand Total */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-sm font-black text-[#1E1B4B]">Total Amount</span>
                  <p className="text-[10px] text-slate-400">Inclusive of VAT (if applicable)</p>
                </div>
                <span className="text-xl font-black text-[#1E1B4B]">{formatPeso(total)}</span>
              </div>

              {/* Terms & Conditions Box */}
              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>By placing your order, you agree to:</span>
                </div>

                <div className="space-y-2 pl-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreedTerms}
                      onCheckedChange={(c) => setAgreedTerms(!!c)}
                      className="rounded border-emerald-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-700 cursor-pointer">
                      SofiaCart{" "}
                      <Link href="#" className="text-[#5B3DF5] underline font-medium">
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="privacy"
                      checked={agreedPrivacy}
                      onCheckedChange={(c) => setAgreedPrivacy(!!c)}
                      className="rounded border-emerald-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <label htmlFor="privacy" className="text-xs text-slate-700 cursor-pointer">
                      SofiaCart{" "}
                      <Link href="#" className="text-[#5B3DF5] underline font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </div>

              {/* CTA PLACE ORDER BUTTON */}
              <Button
                asChild
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-[#FF2A7A] to-[#FF2A7A] text-sm font-bold text-white shadow-lg shadow-pink-500/20 hover:opacity-95 transition-all"
              >
                <Link href="/order/complete" className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" /> Place Order →
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <LockKeyhole className="h-3.5 w-3.5 text-slate-400" />
                <span>Your payment information is secure and encrypted.</span>
              </div>
            </Card>

            {/* TRUST & SECURITY BADGES */}
            <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5]">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Secure Delivery</span>
                <span className="text-[8px] text-slate-400">Your orders are safe</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Secure Payment</span>
                <span className="text-[8px] text-slate-400">100% protected</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5]">
                  <RotateCcw className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Easy Returns</span>
                <span className="text-[8px] text-slate-400">7-day returns</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5]">
                  <Headphones className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Customer Support</span>
                <span className="text-[8px] text-slate-400">We're here to help</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}