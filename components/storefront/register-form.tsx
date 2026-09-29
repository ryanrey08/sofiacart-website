"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Enter at least 2 characters."),
    lastName: z.string().min(2, "Enter at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().min(10, "Enter a valid mobile number."),
    password: z.string().min(8, "Use at least 8 characters."),
    passwordConfirmation: z.string().min(8, "Please confirm your password."),
    addressLine1: z.string().min(4, "Enter your street address."),
    city: z.string().min(2, "Enter your city."),
    province: z.string().min(2, "Enter your province or region."),
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
  phone: "",
  password: "",
  passwordConfirmation: "",
  addressLine1: "",
  city: "",
  province: "",
  postalCode: "",
  acceptTerms: false,
};

export function RegisterForm() {
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = (values: RegisterValues) => {
    setSubmittedName(`${values.firstName} ${values.lastName}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create your SofiaCart account</CardTitle>
          <CardDescription>
            Complete the essentials below so checkout, order tracking, and future reorder flows are ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Tell us who should receive your orders and account updates.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="Sofia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Santos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input placeholder="sofia@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile number</FormLabel>
                        <FormControl>
                          <Input placeholder="0917 555 0101" {...field} />
                        </FormControl>
                        <FormDescription>We use this for delivery coordination.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Account Security</h2>
                  <p className="text-sm text-muted-foreground">Choose a password that keeps your purchase history and saved addresses secure.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground">This becomes your default delivery destination for faster checkout.</p>
                </div>
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street address</FormLabel>
                      <FormControl>
                        <Input placeholder="32 Sampaguita Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Quezon City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province / Region</FormLabel>
                        <FormControl>
                          <Input placeholder="Metro Manila" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal code</FormLabel>
                        <FormControl>
                          <Input placeholder="1100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel>I agree to the Terms & Conditions</FormLabel>
                        <FormDescription>
                          I consent to order updates, delivery coordination, and responsible handling of my account details.
                        </FormDescription>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" type="submit">Create account</Button>
                <Button variant="ghost" type="button" onClick={() => form.reset(defaultValues)}>
                  Reset form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Why create an account?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Save delivery addresses, speed through checkout, and keep your order history in one place.</p>
            <ul className="space-y-3">
              <li>• Faster reorders from previous purchases</li>
              <li>• Personalized deals and featured products</li>
              <li>• Delivery status updates in one dashboard</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Submission preview</CardTitle>
            <CardDescription>This demo route validates the form client-side and prepares the payload structure for API wiring.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {submittedName ? (
              <>
                <p className="font-medium text-foreground">Account ready for {submittedName}</p>
                <p>The registration form is validated and ready to connect to the backend register endpoint next.</p>
              </>
            ) : (
              <p>Complete the form and submit to confirm the customer account experience.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
