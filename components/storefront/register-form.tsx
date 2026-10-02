"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Home as HomeIcon,
  ShoppingBag,
  Truck,
  Percent,
  Settings,
  ShieldCheck,
  Headphones,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InlineError } from "@/components/storefront/states";
import { useRegister } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { ApiClientError } from "@/lib/api/client";
import { safeRedirect } from "@/lib/utils/redirect";
import { toast } from "@/stores/toast-store";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Enter at least 2 characters."),
    lastName: z.string().min(2, "Enter at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    phonePrefix: z.string(),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9()\-\s]{7,16}$/, "Enter a valid mobile number, e.g. 912 345 6789."),
    password: z.string().min(8, "Use at least 8 characters."),
    passwordConfirmation: z.string().min(8, "Please confirm your password."),
    addressLine1: z.string().min(4, "Enter your street address."),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "Enter your city/municipality."),
    province: z.string().min(2, "Enter your province."),
    postalCode: z.string().min(4, "Enter your postal code."),
    acceptTerms: z.boolean().refine((value) => value, "You must accept the terms to continue."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

const defaultValues: RegisterValues = {
  firstName: "",
  lastName: "",
  email: "",
  phonePrefix: "+63",
  phone: "",
  password: "",
  passwordConfirmation: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "",
  postalCode: "",
  acceptTerms: false,
};

/** Backend validation keys (RegisterRequest) → form fields. */
const serverFieldMap: Record<string, keyof RegisterValues> = {
  name: "firstName",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  phone: "phone",
  password: "password",
  passwordConfirmation: "passwordConfirmation",
  "shippingAddress.phone": "phone",
  "shippingAddress.line1": "addressLine1",
  "shippingAddress.line2": "addressLine2",
  "shippingAddress.city": "city",
  "shippingAddress.state": "province",
  "shippingAddress.postalCode": "postalCode",
};

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"), "/account");
  const { hydrated, isAuthenticated } = useSession();
  const register = useRegister();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (hydrated && isAuthenticated && !register.isPending && !register.isSuccess) {
      router.replace(redirectTo);
    }
  }, [hydrated, isAuthenticated, redirectTo, register.isPending, register.isSuccess, router]);

  function onSubmit(values: RegisterValues) {
    const phone = `${values.phonePrefix} ${values.phone.trim()}`;
    const recipientName = `${values.firstName.trim()} ${values.lastName.trim()}`;

    register.mutate(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        shippingAddress: {
          label: "Home",
          recipientName,
          phone,
          line1: values.addressLine1.trim(),
          line2: values.addressLine2?.trim() || null,
          city: values.city.trim(),
          state: values.province.trim(),
          postalCode: values.postalCode.trim(),
        },
      },
      {
        onSuccess: ({ user }) => {
          toast.success(`Welcome to SofiaCart, ${user.name.split(" ")[0]}!`, "We sent a verification link to your email.");
          router.replace(redirectTo);
        },
        onError: (error) => {
          if (error instanceof ApiClientError && error.errors) {
            for (const [key, messages] of Object.entries(error.errors)) {
              const field = serverFieldMap[key];
              if (field) form.setError(field, { type: "server", message: messages[0] });
            }
          }
        },
      }
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 min-h-[calc(100vh-6rem)] py-4">
      {/* LEFT COLUMN: Registration Form */}
      <Card className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
        <CardContent className="p-0 space-y-6">
          {/* Form Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#1E1B4B]">Create Your Account</h1>
              <p className="text-xs text-slate-500 mt-1">
                Join SofiaCart and start shopping today!
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#5B3DF5] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* SECTION 1: Personal Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-[#5B3DF5]">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#1E1B4B]">Personal Information</h2>
                    <p className="text-[10px] text-slate-400">Please provide your basic details.</p>
                  </div>
                </div>

                {/* Name Row */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Juan"
                              className="h-10 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Dela Cruz"
                              className="h-10 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            type="email"
                            placeholder="juan.delacruz@email.com"
                            className="h-10 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Mobile Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-semibold text-slate-700">
                        Mobile Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <div className="flex h-10 items-center justify-between gap-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-700">
                            <span>🇵🇭 +63</span>
                            <ChevronDown className="h-3 w-3 text-slate-400" />
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="912 345 6789"
                              className="h-10 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                              {...field}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* SECTION 2: Account Security */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-[#5B3DF5]">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#1E1B4B]">Account Security</h2>
                    <p className="text-[10px] text-slate-400">Set a secure password for your account.</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className="h-10 pl-9 pr-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          Confirm Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="h-10 pl-9 pr-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Password must be at least 8 characters. A mix of letters, numbers and symbols is stronger.
                </p>
              </div>

              {/* SECTION 3: Shipping Address */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-[#5B3DF5]">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#1E1B4B]">Shipping Address</h2>
                    <p className="text-[10px] text-slate-400">Add your default delivery address.</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Address Line 1 */}
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          Address Line 1 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <HomeIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="House No., Street, Barangay"
                              className="h-10 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Address Line 2 */}
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          Address Line 2
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Unit, Building, Subdivision (Optional)"
                            className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* City, Province, Postal Code */}
                <div className="grid gap-3 grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          City/Municipality <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Select City/Municipality"
                            className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          Province <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Select Province"
                            className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-semibold text-slate-700">
                          Postal Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="e.g. 1000"
                              className="h-10 pl-9 rounded-xl border-slate-200 bg-slate-50/50 text-xs focus-visible:ring-[#5B3DF5]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        className="rounded border-slate-300 data-[state=checked]:bg-[#FF2A7A] data-[state=checked]:border-[#FF2A7A]"
                      />
                    </FormControl>
                    <label className="text-xs text-slate-600 leading-none">
                      I agree to the <span className="font-semibold text-[#5B3DF5]">Terms and Conditions</span> and{" "}
                      <span className="font-semibold text-[#5B3DF5]">Privacy Policy</span> of SofiaCart.
                    </label>
                  </FormItem>
                )}
              />

              {register.isError && !(register.error instanceof ApiClientError && register.error.status === 422) ? (
                <InlineError error={register.error} />
              ) : null}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={register.isPending}
                className="w-full h-11 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF2A7A] to-[#FF2A7A] text-sm font-bold text-white shadow-md hover:opacity-95"
              >
                {register.isPending ? "Creating your account…" : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* RIGHT COLUMN: Welcome Banner & Features */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        {/* Top Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFE5EC] via-[#F3E8FF] to-[#E0E7FF] p-8 flex flex-col justify-between shadow-sm min-h-[320px]">
          <div className="max-w-xs space-y-2 z-10">
            <h2 className="text-3xl font-black text-[#110C3B]">
              Welcome to <br />
              <span className="text-[#FF2A7A]">Sofia</span>
              <span className="text-[#FF6B00]">Cart</span>
            </h2>
            <p className="text-xs font-bold text-[#110C3B]">Everything. In One Cart.</p>
            <p className="text-xs text-slate-600 pt-2 leading-relaxed">
              Create an account to enjoy a faster, easier and more personalized shopping experience.
            </p>
          </div>

          {/* Bag illustration */}
          <ShoppingBag aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 h-48 w-48 rotate-12 text-[#5B3DF5]/10" />
        </div>

        {/* Feature Cards Grid (2x2) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[#FF2A7A]">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#110C3B]">Faster Checkout</h4>
              <p className="text-[10px] text-slate-500">Save your details for a quicker purchase.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5]">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#110C3B]">Track Your Orders</h4>
              <p className="text-[10px] text-slate-500">Follow every order from placement to completion.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[#FF2A7A]">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#110C3B]">Exclusive Deals</h4>
              <p className="text-[10px] text-slate-500">Be the first to know about promos and discounts.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#5B3DF5]">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#110C3B]">Manage Your Account</h4>
              <p className="text-[10px] text-slate-500">Update your profile, addresses and preferences.</p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-5 w-5 text-slate-700 mb-1" />
            <span className="text-[11px] font-bold text-slate-800">Secure & Safe</span>
            <span className="text-[9px] text-slate-400">Your information is protected.</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <Headphones className="h-5 w-5 text-slate-700 mb-1" />
            <span className="text-[11px] font-bold text-slate-800">Customer Support</span>
            <span className="text-[9px] text-slate-400">We&apos;re here to help.</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <ThumbsUp className="h-5 w-5 text-slate-700 mb-1" />
            <span className="text-[11px] font-bold text-slate-800">Trusted Store</span>
            <span className="text-[9px] text-slate-400">Quality products. Great service.</span>
          </div>
        </div>
      </div>
    </div>
  );
}