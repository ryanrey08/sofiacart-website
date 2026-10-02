"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Lock,
  User,
  Phone,
  Mail,
  Home,
  Building,
  MapPin,
  Truck,
  Bike,
  CreditCard,
  Building2,
  Banknote,
  Tag,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Pencil,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { sampleAddress, sampleCart } from "@/lib/mocks/storefront";
import { formatCurrency } from "@/lib/utils/format";

export default function CheckoutPage() {
  const [useAccountAddress, setUseAccountAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");

  const subtotal = sampleCart.subtotal;
  const discount = 1000;
  const shippingFee = deliveryMethod === "express" ? 250 : 100;
  const total = subtotal - discount + shippingFee;

  return (
    <Container className="space-y-6 py-6 max-w-7xl">
      {/* Top Header & Checkout Stepper */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-100">
        {/* Stepper */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-[11px] font-bold text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>Cart</span>
          </div>
          <span className="text-slate-300">—</span>
          <div className="flex items-center gap-1.5 text-[#5B3DF5]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5B3DF5] text-[11px] font-bold text-white">
              2
            </span>
            <span className="font-bold text-[#1E1B4B]">Checkout</span>
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
            <span>Place Order</span>
          </div>
          <span className="text-slate-300">—</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
              5
            </span>
            <span>Complete Order</span>
          </div>
        </div>

        {/* Secure Checkout Badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700 border border-amber-200/60">
          <Lock className="h-3.5 w-3.5 text-amber-600" />
          <span>
            <strong className="font-bold">Secure Checkout</strong>{" "}
            <span className="text-amber-600/80 hidden sm:inline">| Your information is protected</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Steps, Right Summary */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Steps (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping Information */}
          <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-base font-black text-[#1E1B4B]">
                <MapPin className="h-5 w-5 text-[#5B3DF5]" />
                <h2>1. Shipping Information</h2>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="useAccountAddress"
                  checked={useAccountAddress}
                  onCheckedChange={(checked) => setUseAccountAddress(!!checked)}
                  className="rounded border-slate-300 data-[state=checked]:bg-[#5B3DF5] data-[state=checked]:border-[#5B3DF5]"
                />
                <Label htmlFor="useAccountAddress" className="text-xs text-slate-600 cursor-pointer">
                  Use my account address
                </Label>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Juan Dela Cruz"
                    defaultValue={useAccountAddress ? sampleAddress.recipientName : ""}
                    className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-[#5B3DF5]"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="+63 912 345 6789"
                    defaultValue={useAccountAddress ? sampleAddress.phone : ""}
                    className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-[#5B3DF5]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="juan.delacruz@email.com"
                    className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-[#5B3DF5]"
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="123 Rizal Street, Barangay San Isidro"
                    defaultValue={useAccountAddress ? sampleAddress.line1 : ""}
                    className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-[#5B3DF5]"
                  />
                </div>
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Address Line 2 (Optional)</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Unit, Building, Subdivision"
                    className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-[#5B3DF5]"
                  />
                </div>
              </div>

              {/* City / Municipality */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  City / Municipality <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="makati">
                  <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs focus:ring-[#5B3DF5]">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="makati">Makati City</SelectItem>
                    <SelectItem value="taguig">Taguig City</SelectItem>
                    <SelectItem value="quezon">Quezon City</SelectItem>
                    <SelectItem value="manila">Manila City</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Province */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Province <span className="text-red-500">*</span>
                </Label>
                <Select defaultValue="metro-manila">
                  <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs focus:ring-[#5B3DF5]">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro-manila">Metro Manila</SelectItem>
                    <SelectItem value="cavite">Cavite</SelectItem>
                    <SelectItem value="laguna">Laguna</SelectItem>
                    <SelectItem value="bulacan">Bulacan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Postal Code */}
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Postal Code <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="1200"
                    defaultValue={useAccountAddress ? sampleAddress.postalCode : ""}
                    className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-[#5B3DF5]"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* STEP 2: Delivery Method */}
          <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-black text-[#1E1B4B]">
              <Truck className="h-5 w-5 text-[#5B3DF5]" />
              <h2>2. Delivery Method</h2>
            </div>

            <RadioGroup
              value={deliveryMethod}
              onValueChange={setDeliveryMethod}
              className="grid gap-3 sm:grid-cols-2"
            >
              {/* Standard Delivery */}
              <Label
                htmlFor="standard"
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                  deliveryMethod === "standard"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <RadioGroupItem value="standard" id="standard" className="mt-1 text-[#5B3DF5]" />
                <div className="flex items-start gap-3 w-full">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#5B3DF5]">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#1E1B4B]">Standard Delivery</p>
                    <p className="text-[10px] text-slate-500">3 - 5 business days</p>
                    <p className="text-xs font-black text-[#1E1B4B] pt-1">₱ 100.00</p>
                  </div>
                </div>
              </Label>

              {/* Express Delivery */}
              <Label
                htmlFor="express"
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                  deliveryMethod === "express"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <RadioGroupItem value="express" id="express" className="mt-1 text-[#5B3DF5]" />
                <div className="flex items-start gap-3 w-full">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#5B3DF5]">
                    <Bike className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#1E1B4B]">Express Delivery</p>
                    <p className="text-[10px] text-slate-500">1 - 2 business days</p>
                    <p className="text-xs font-black text-[#1E1B4B] pt-1">₱ 250.00</p>
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </Card>

          {/* STEP 3: Payment Method */}
          <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-black text-[#1E1B4B]">
              <CreditCard className="h-5 w-5 text-[#5B3DF5]" />
              <h2>3. Payment Method</h2>
            </div>

            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-2.5"
            >
              {/* Credit / Debit Card */}
              <Label
                htmlFor="card"
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  paymentMethod === "card"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="card" id="card" className="text-[#5B3DF5]" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-[#5B3DF5]">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B4B]">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-500">Visa, Mastercard, JCB</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-blue-700">
                    VISA
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-orange-600">
                    mastercard
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-blue-900">
                    JCB
                  </span>
                </div>
              </Label>

              {/* GCash */}
              <Label
                htmlFor="gcash"
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  paymentMethod === "gcash"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="gcash" id="gcash" className="text-[#5B3DF5]" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                    GCash
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B4B]">GCash</p>
                    <p className="text-[10px] text-slate-500">Pay using your GCash account</p>
                  </div>
                </div>
              </Label>

              {/* Maya */}
              <Label
                htmlFor="maya"
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  paymentMethod === "maya"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="maya" id="maya" className="text-[#5B3DF5]" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-[10px]">
                    maya
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B4B]">Maya</p>
                    <p className="text-[10px] text-slate-500">Pay using your Maya account</p>
                  </div>
                </div>
              </Label>

              {/* Bank Transfer */}
              <Label
                htmlFor="bank"
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  paymentMethod === "bank"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="bank" id="bank" className="text-[#5B3DF5]" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B4B]">Bank Transfer</p>
                    <p className="text-[10px] text-slate-500">
                      Direct bank transfer (BPI, BDO, Metrobank, etc.)
                    </p>
                  </div>
                </div>
              </Label>

              {/* Cash on Delivery */}
              <Label
                htmlFor="cod"
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="cod" id="cod" className="text-[#5B3DF5]" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Banknote className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B4B]">Cash on Delivery (COD)</p>
                    <p className="text-[10px] text-slate-500">Pay upon delivery</p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 italic">
                  (Available for selected areas only)
                </span>
              </Label>
            </RadioGroup>
          </Card>
        </div>

        {/* RIGHT COLUMN: Order Summary (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-[#1E1B4B]">
                Order Summary ({sampleCart.items.length} items)
              </h2>
              <Link
                href="/cart"
                className="flex items-center gap-1 text-xs font-bold text-[#5B3DF5] hover:underline"
              >
                <Pencil className="h-3 w-3" /> Edit Cart
              </Link>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 divide-y divide-slate-100">
              {sampleCart.items.map((item) => (
                <div key={item.productId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 border border-slate-100 overflow-hidden p-1 flex items-center justify-center">
                      <img
                        src={item.image || "/assets/placeholder-product.png"}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E1B4B] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Brand: <span className="text-slate-600">Generic</span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Color: <span className="text-slate-600">Default</span>
                      </p>
                      <p className="text-xs font-black text-[#1E1B4B] pt-0.5">
                        {formatCurrency(item.unitPrice, item.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    <p className="text-xs font-black text-[#1E1B4B]">
                      {formatCurrency(item.unitPrice * item.quantity, item.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-slate-100" />

            {/* Promo Code Entry */}
            <div className="space-y-2">
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

            <Separator className="bg-slate-100" />

            {/* Financial Totals */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({sampleCart.items.length} items)</span>
                <span className="font-bold text-[#1E1B4B]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-[#1E1B4B]">{formatCurrency(shippingFee)}</span>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-[#1E1B4B]">Total Amount</span>
              <div className="text-right">
                <span className="text-xl font-black text-[#1E1B4B]">
                  {formatCurrency(total)}
                </span>
                <p className="text-[9px] text-slate-400">Inclusive of VAT (if applicable)</p>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <Button
              asChild
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF2A7A] to-[#FF2A7A] text-xs font-bold text-white shadow-md hover:opacity-95"
            >
              <Link href="/place-order" className="flex items-center justify-center gap-2">
                <Lock className="h-4 w-4" /> Place Order →
              </Link>
            </Button>

            <p className="text-center text-[10px] text-slate-400">
              By placing your order, you agree to SofiaCart's{" "}
              <Link href="#" className="text-[#5B3DF5] underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#5B3DF5] underline">
                Privacy Policy
              </Link>
              .
            </p>
          </Card>

          {/* Security & Trust Badges */}
          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-4 w-4 text-[#5B3DF5] mb-1" />
              <span className="text-[10px] font-bold text-slate-800">Secure Delivery</span>
              <span className="text-[8px] text-slate-400">Your orders are safe</span>
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
        </div>
      </div>
    </Container>
  );
}