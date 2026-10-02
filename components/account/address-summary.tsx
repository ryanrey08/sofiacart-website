import { formatAddressLines } from "@/lib/utils/format";
import type { AddressSnapshot } from "@/types/domain";

export function AddressSummary({ address, className }: { address: AddressSnapshot; className?: string }) {
  return (
    <div className={className ?? "space-y-0.5 text-xs text-slate-600"}>
      <p className="font-bold text-ink">
        {address.recipientName}
        {address.label ? <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">{address.label}</span> : null}
      </p>
      {formatAddressLines(address).map((line) => <p key={line}>{line}</p>)}
      <p className="pt-1">Phone: {address.phone}</p>
    </div>
  );
}
