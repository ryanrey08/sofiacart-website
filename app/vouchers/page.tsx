import type { Metadata } from "next";

import { VoucherList } from "@/components/account/voucher-list";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Deals & Vouchers" };

export default function VouchersPage() {
  return (
    <Container className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-black text-ink">Deals & Vouchers</h1>
        <p className="text-xs text-slate-500">Copy a code and apply it in your cart or at checkout.</p>
      </div>
      <VoucherList />
    </Container>
  );
}
