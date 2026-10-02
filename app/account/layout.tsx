import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { RequireAuth } from "@/components/auth/require-auth";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: { default: "My Account", template: "%s | SofiaCart" } };

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <Container className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[230px_1fr]">
        <AccountSidebar />
        <div className="min-w-0 space-y-6">{children}</div>
      </Container>
    </RequireAuth>
  );
}
