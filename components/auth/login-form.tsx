"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthAside } from "@/components/auth/auth-aside";
import { PasswordInput } from "@/components/auth/password-input";
import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { ApiClientError } from "@/lib/api/client";
import { safeRedirect } from "@/lib/utils/redirect";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/stores/toast-store";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

const sessionMessages = {
  expired: "Your session has expired. Please sign in again.",
  deactivated: "This account has been deactivated. Contact support if you think this is a mistake.",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"), "/account");
  const { hydrated, isAuthenticated } = useSession();
  const sessionEndReason = useAuthStore((state) => state.sessionEndReason);
  const login = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    if (hydrated && isAuthenticated && !login.isPending && !login.isSuccess) {
      router.replace(redirectTo);
    }
  }, [hydrated, isAuthenticated, login.isPending, login.isSuccess, redirectTo, router]);

  function onSubmit(values: LoginValues) {
    login.mutate(values, {
      onSuccess: ({ user }) => {
        toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
        router.replace(redirectTo);
      },
      onError: (error) => {
        if (error instanceof ApiClientError && error.status === 422) {
          const message = error.fieldError("email") ?? error.fieldError("password");
          if (message) form.setError("email", { type: "server", message });
        }
      },
    });
  }

  const showGenericError = login.isError && !(login.error instanceof ApiClientError && login.error.status === 422);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-black text-ink">Welcome Back!</h1>
          <p className="text-xs text-slate-500">Sign in to access your orders, wishlist and account.</p>
        </div>

        {hydrated && sessionEndReason ? (
          <p role="status" className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            {sessionMessages[sessionEndReason]}
          </p>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold text-slate-700">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input type="email" autoComplete="email" placeholder="you@email.com" className="h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-9 text-xs focus-visible:ring-brand" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-semibold text-slate-700">Password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="current-password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-xs font-medium text-slate-600">Remember me</FormLabel>
                  </FormItem>
                )}
              />
              <Link href="/forgot-password" className="text-xs font-semibold text-brand hover:underline">
                Forgot password?
              </Link>
            </div>

            {showGenericError ? <InlineError error={login.error} /> : null}

            <Button type="submit" disabled={login.isPending} className="h-11 w-full rounded-full bg-cta text-sm font-bold text-white shadow-md hover:opacity-95">
              {login.isPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href={`/register${redirectTo !== "/account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="font-bold text-brand hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
      <AuthAside title="Welcome back to" subtitle="Sign in for a faster, easier and more personalized shopping experience." />
    </div>
  );
}
