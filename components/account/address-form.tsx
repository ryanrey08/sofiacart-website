"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiClientError } from "@/lib/api/client";
import type { Address, AddressInput } from "@/types/domain";

// Mirrors AddressRules in sofiacart-website-backend.
const addressSchema = z.object({
  label: z.string().trim().max(50),
  recipientName: z.string().trim().min(1, "Enter the recipient's name.").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number, e.g. +63 912 345 6789."),
  line1: z.string().trim().min(1, "Enter the street address.").max(255),
  line2: z.string().trim().max(255),
  city: z.string().trim().min(1, "Enter the city or municipality.").max(100),
  state: z.string().trim().max(100),
  postalCode: z.string().trim().min(1, "Enter the postal code.").max(20),
  country: z.string().trim().max(100),
  isDefault: z.boolean(),
});

type AddressValues = z.infer<typeof addressSchema>;

const fields: { name: Exclude<keyof AddressValues, "isDefault">; label: string; placeholder: string; required?: boolean; wide?: boolean; autoComplete?: string }[] = [
  { name: "recipientName", label: "Full Name", placeholder: "Juan Dela Cruz", required: true, autoComplete: "name" },
  { name: "phone", label: "Phone Number", placeholder: "+63 912 345 6789", required: true, autoComplete: "tel" },
  { name: "line1", label: "Address Line 1", placeholder: "House No., Street, Barangay", required: true, autoComplete: "address-line1" },
  { name: "line2", label: "Address Line 2", placeholder: "Unit, Building, Subdivision (Optional)", autoComplete: "address-line2" },
  { name: "city", label: "City / Municipality", placeholder: "Makati City", required: true, autoComplete: "address-level2" },
  { name: "state", label: "Province", placeholder: "Metro Manila", autoComplete: "address-level1" },
  { name: "postalCode", label: "Postal Code", placeholder: "1200", required: true, autoComplete: "postal-code" },
  { name: "country", label: "Country", placeholder: "Philippines", autoComplete: "country-name" },
  { name: "label", label: "Label", placeholder: "Home, Office… (Optional)" },
];

export function AddressForm({
  address,
  pending,
  error,
  submitLabel = "Save Address",
  onSubmit,
  onCancel,
  showDefaultToggle = true,
}: {
  address?: Address | null;
  pending: boolean;
  error: unknown;
  submitLabel?: string;
  onSubmit: (input: AddressInput, setServerErrors: (error: unknown) => void) => void;
  onCancel?: () => void;
  showDefaultToggle?: boolean;
}) {
  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: address?.label ?? "",
      recipientName: address?.recipientName ?? "",
      phone: address?.phone ?? "",
      line1: address?.line1 ?? "",
      line2: address?.line2 ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      postalCode: address?.postalCode ?? "",
      country: address?.country ?? "Philippines",
      isDefault: address?.isDefault ?? false,
    },
  });

  function setServerErrors(serverError: unknown) {
    if (serverError instanceof ApiClientError && serverError.errors) {
      for (const [key, messages] of Object.entries(serverError.errors)) {
        const name = key.replace(/^address\./, "") as keyof AddressValues;
        if (name in form.getValues()) form.setError(name, { type: "server", message: messages[0] });
      }
    }
  }

  function submit(values: AddressValues) {
    onSubmit(
      {
        label: values.label || null,
        recipientName: values.recipientName,
        phone: values.phone,
        line1: values.line1,
        line2: values.line2 || null,
        city: values.city,
        state: values.state || null,
        postalCode: values.postalCode,
        country: values.country || null,
        isDefault: values.isDefault,
      },
      setServerErrors
    );
  }

  const showError = error && !(error instanceof ApiClientError && error.status === 422);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4" noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((entry) => (
            <FormField
              key={entry.name}
              control={form.control}
              name={entry.name}
              render={({ field }) => (
                <FormItem className={entry.wide ? "sm:col-span-2" : undefined}>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {entry.label} {entry.required ? <span className="text-red-500">*</span> : null}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={entry.placeholder} autoComplete={entry.autoComplete} className="h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-brand" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          ))}
        </div>
        {showDefaultToggle ? (
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} disabled={address?.isDefault} />
                </FormControl>
                <FormLabel className="cursor-pointer text-xs text-slate-600">Set as my default address</FormLabel>
              </FormItem>
            )}
          />
        ) : null}
        {showError ? <InlineError error={error} /> : null}
        <div className="flex gap-2">
          <Button type="submit" disabled={pending} className="rounded-full bg-brand text-xs font-bold">
            {pending ? "Saving…" : submitLabel}
          </Button>
          {onCancel ? <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full text-xs">Cancel</Button> : null}
        </div>
      </form>
    </Form>
  );
}
