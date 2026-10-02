import { TicketPercent } from "lucide-react";
import type { Metadata } from "next";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { VoucherList } from "@/components/account/voucher-list";

export const metadata: Metadata = { title: "Vouchers & Promotions" };

export default function AccountVouchersPage() {
  return (
    <>
      <AccountPageHeader icon={TicketPercent} title="Vouchers & Promotions" description="Copy a code and apply it in your cart or at checkout." />
      <VoucherList />
    </>
  );
}
