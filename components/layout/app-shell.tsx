import type { ReactNode } from "react";

import { EmailVerificationBanner } from "@/components/layout/email-verification-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <EmailVerificationBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
