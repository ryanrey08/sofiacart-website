"use client";

import Link from "next/link";
import {
  Check,
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  FileText,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  Printer,
  ListOrdered,
  Headphones,
  ShoppingBag,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { latestOrder } from "@/lib/mocks/storefront";
import { formatCurrency, formatShortDate } from "@/lib/utils/format";

export default function OrderCompletePage() {
  const orderItems = [
    {
      id: "1",
      name: 'Laptop 15.6" Intel i5 8GB RAM 512GB SSD',
      brand: "Lenovo",
      color: "Gray",
      inStock: true,
      price: 32990,
      quantity: 1,
      image: "/assets/laptop.png",
    },
    {
      id: "2",
      name: "Wireless Earbuds with Noise Cancellation",
      brand: "Anker",
      color: "White",
      inStock: true,
      price: 2990,
      quantity: 1,
      image: "/assets/earbuds.png",
    },
    {
      id: "3",
      name: "Air Fryer 5L Digital Touch",
      brand: "Philips",
      color: "Black",
      inStock: true,
      price: 4590,
      quantity: 1,
      image: "/assets/airfryer.png",
    },
  ];

  const subtotal = 40570;
  const discount = 1000;
  const shippingFee = 100;
  const total = subtotal - discount + shippingFee;

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
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white">
              <Check className="h-3.5 w-3.5" />
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

          {/* Step 4: Place Order */}
          <div className="flex items-center gap-2 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">Place Order</span>
          </div>

          <div className="h-[2px] w-8 sm:w-16 bg-[#5B3DF5]/30" />

          {/* Step 5: Order Complete (Active Step) */}
          <div className="flex items-center gap-2 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white font-bold text-[11px]">
              5
            </span>
            <span className="font-bold text-[#1E1B4B]">Order Complete</span>
          </div>
        </div>

        {/* 2 COLUMN LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: Success Banner, Order Details & Items (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* HERO THANK YOU BANNER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-purple-50/50 to-white border border-emerald-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5 z-10">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <Check className="h-10 w-10 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] tracking-tight">
                    Thank you for your order!
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    Your order has been successfully placed.
                  </p>
                  <p className="text-xs text-slate-500">
                    We've received your order and it's now being processed. You will receive a confirmation email with your order details.
                  </p>
                </div>
              </div>

              {/* Shopping Bag Illustration graphic */}
              <div className="relative shrink-0 flex items-center justify-center w-28 h-28 bg-gradient-to-tr from-[#5B3DF5]/10 to-[#FF2A7A]/10 rounded-2xl border border-white/80 shadow-inner">
                <div className="relative flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md border border-slate-100">
                  <span className="text-xl font-black text-[#FF2A7A]">S</span>
                </div>
              </div>
            </div>

            {/* ORDER DETAILS & ITEMS CARD */}
            <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-black text-[#1E1B4B]">Order Details</h2>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold text-[#1E1B4B]">
                    Order Number:{" "}
                    <span className="font-extrabold text-[#5B3DF5]">
                      {latestOrder.orderNumber || "SC20260924-001234"}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Placed on: {formatShortDate(latestOrder.placedAt)} at 10:45 AM
                  </p>
                </div>
              </div>

              {/* Items Table Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E1B4B]">
                    <ShoppingCart className="h-4 w-4 text-[#5B3DF5]" />
                    <span>Order Items ({orderItems.length} items)</span>
                  </div>
                  <Link
                    href="/orders"
                    className="text-xs font-bold text-[#5B3DF5] hover:underline flex items-center gap-1"
                  >
                    View All Items →
                  </Link>
                </div>

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
                      {orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <h3 className="font-bold text-[#1E1B4B] line-clamp-1">{item.name}</h3>
                                <p className="text-[11px] text-slate-400">
                                  Brand: <span className="text-slate-600">{item.brand}</span> | Color:{" "}
                                  <span className="text-slate-600">{item.color}</span>
                                </p>
                                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                                  In Stock
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right font-bold text-[#1E1B4B]">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="py-4 text-center font-semibold text-slate-600">
                            {item.quantity}
                          </td>
                          <td className="py-4 text-right font-bold text-[#1E1B4B]">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Bottom Info Grid */}
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                {/* Shipping Info */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E1B4B]">
                    <MapPin className="h-4 w-4 text-[#5B3DF5]" />
                    <span>Shipping Information</span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    <p className="font-bold text-slate-800">
                      {latestOrder.shippingAddress?.recipientName || "Juan Dela Cruz"}
                    </p>
                    <p>{latestOrder.shippingAddress?.line1 || "123 Rizal Street, Barangay San Isidro"}</p>
                    <p>
                      {latestOrder.shippingAddress?.city || "Makati City"},{" "}
                      {latestOrder.shippingAddress?.state || "Metro Manila"}{" "}
                      {latestOrder.shippingAddress?.postalCode || "1200"}
                    </p>
                    <p>{latestOrder.shippingAddress?.country || "Philippines"}</p>
                    <p>Phone: {latestOrder.shippingAddress?.phone || "+63 912 345 6789"}</p>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E1B4B]">
                    <Truck className="h-4 w-4 text-[#5B3DF5]" />
                    <span>Delivery Method</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <p className="font-bold text-slate-800">Standard Delivery</p>
                    <p>3 - 5 business days</p>
                    <p className="font-bold text-[#1E1B4B] pt-0.5">₱ 100.00</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E1B4B]">
                    <CreditCard className="h-4 w-4 text-[#5B3DF5]" />
                    <span>Payment Method</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <div className="flex h-6 w-9 shrink-0 items-center justify-center rounded bg-slate-900 text-white font-bold text-[8px]">
                      <span className="text-red-500">●</span>
                      <span className="text-amber-400 -ml-0.5">●</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Credit / Debit Card</p>
                      <p className="text-slate-400">**** **** **** 1234</p>
                      <p className="text-slate-400">Expires 10/28</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Order Summary & Actions (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Email Banner */}
            <div className="rounded-2xl bg-purple-50/80 border border-purple-100 p-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                <Mail className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#1E1B4B]">A confirmation email has been sent!</p>
                <p className="text-[11px] text-slate-500">
                  We've sent the order details to{" "}
                  <span className="text-slate-700 font-semibold">juan.delacruz@email.com</span>. Please check your inbox (and spam folder).
                </p>
              </div>
            </div>

            {/* SUMMARY CARD */}
            <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-base font-black text-[#1E1B4B] border-b border-slate-100 pb-3">
                <FileText className="h-5 w-5 text-[#5B3DF5]" />
                <h2>Order Summary</h2>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({orderItems.length} items)</span>
                  <span className="font-bold text-[#1E1B4B]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-[#1E1B4B]">{formatCurrency(shippingFee)}</span>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Total */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-sm font-black text-[#1E1B4B]">Total Amount</span>
                  <p className="text-[10px] text-slate-400">Inclusive of VAT (if applicable)</p>
                </div>
                <span className="text-xl font-black text-[#1E1B4B]">{formatCurrency(total)}</span>
              </div>

              {/* What's Next Tracker */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1B4B]">
                  <Truck className="h-4 w-4 text-[#5B3DF5]" />
                  <span>What's Next?</span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-center py-2">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[9px] font-bold text-[#1E1B4B]">Order Confirmed</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[9px] font-bold text-[#1E1B4B]">Processing Your Order</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-200 text-slate-300" />
                    <span className="text-[9px] text-slate-400">Out for Delivery</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-200 text-slate-300" />
                    <span className="text-[9px] text-slate-400">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  asChild
                  className="w-full h-11 rounded-2xl bg-[#5B3DF5] hover:bg-[#482bd9] text-xs font-bold text-white shadow-md transition-all"
                >
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <ShoppingBag className="h-4 w-4" /> Continue Shopping
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="h-9 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Link href="/orders" className="flex items-center justify-center gap-1">
                      <ListOrdered className="h-3.5 w-3.5 text-[#5B3DF5]" /> View My Orders
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-9 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
                  >
                    <Printer className="h-3.5 w-3.5 text-[#5B3DF5]" /> Print Order Summary
                  </Button>
                </div>
              </div>
            </Card>

            {/* NEED HELP CARD */}
            <div className="rounded-2xl bg-white border border-slate-100 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5]">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1B4B]">Need Help?</h4>
                  <p className="text-[10px] text-slate-400">
                    If you have any questions about your order, please contact our customer support team.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="h-8 rounded-xl border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shrink-0"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}