"use client";

import { Tag, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useValidateVoucher } from "@/hooks/use-checkout";
import { errorMessage } from "@/lib/api/client";

/**
 * Promo code box. The code is checked with `POST /vouchers/validate`; the discount itself always
 * comes from the backend's checkout summary.
 */
export function VoucherInput({
  appliedCode,
  cartItemIds,
  onApply,
  onRemove,
}: {
  appliedCode: string | null;
  cartItemIds: number[] | null;
  onApply: (code: string) => void;
  onRemove: () => void;
}) {
  const [code, setCode] = useState("");
  const validate = useValidateVoucher();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    validate.mutate(
      { code: value, cartItemIds },
      {
        onSuccess: (result) => {
          onApply(result.voucher.code);
          setCode("");
        },
      }
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand">
        <Tag className="h-3.5 w-3.5" /> Have a Promo Code?
      </div>
      {appliedCode ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
          <span className="font-bold text-emerald-700">{appliedCode} applied</span>
          <button type="button" onClick={onRemove} aria-label="Remove promo code" className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (validate.isError) validate.reset();
            }}
            maxLength={50}
            placeholder="Enter promo code"
            aria-label="Promo code"
            aria-invalid={validate.isError}
            className="h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-brand"
          />
          <Button type="submit" disabled={validate.isPending || !code.trim()} className="h-9 rounded-xl bg-brand px-4 text-xs font-bold text-white hover:bg-brand/90">
            {validate.isPending ? "…" : "Apply"}
          </Button>
        </form>
      )}
      {validate.isError ? <p role="alert" className="text-[11px] text-red-600">{errorMessage(validate.error)}</p> : null}
    </div>
  );
}
