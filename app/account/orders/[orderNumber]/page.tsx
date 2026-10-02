import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { OrderDetail } from "@/components/orders/order-detail";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const decoded = decodeURIComponent(orderNumber);

  return (
    <>
      <AccountPageHeader
        icon={Package}
        title="Order Details"
        description={`Order #${decoded}`}
        action={
          <Link href="/account/orders" className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to My Orders
          </Link>
        }
      />
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <OrderDetail orderNumber={decoded} />
      </div>
    </>
  );
}
