import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { StoreNotFound } from "@/components/store/store-not-found";
import { siteConfig } from "@/lib/constants/site";
import { getCurrentStore } from "@/lib/store/current-store";

import "./globals.css";

// Pages depend on the request's host (each store subdomain is its own storefront).
export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://178.128.111.10");
  const current = await getCurrentStore();

  if (current.status === "not-found") {
    return { metadataBase, title: "Store not found", robots: { index: false, follow: false } };
  }

  if (current.status === "found") {
    return {
      metadataBase,
      title: { default: current.store.name, template: `%s | ${current.store.name}` },
      description: current.store.description || `Shop ${current.store.name} on ${siteConfig.appName}.`,
    };
  }

  return {
    metadataBase,
    title: { default: `${siteConfig.appName} — ${siteConfig.tagline}`, template: `%s | ${siteConfig.appName}` },
    description: siteConfig.description,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const current = await getCurrentStore();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {current.status === "not-found" ? (
          <StoreNotFound slug={current.slug} />
        ) : (
          <AppProviders>
            <AppShell>{children}</AppShell>
          </AppProviders>
        )}
      </body>
    </html>
  );
}
