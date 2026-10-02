"use client";

import { useState } from "react";

import { InlineError } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCancelOrder } from "@/hooks/use-orders";
import { toast } from "@/stores/toast-store";

export function CancelOrderDialog({ orderNumber }: { orderNumber: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const cancel = useCancelOrder();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) cancel.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 rounded-xl border-red-200 text-xs font-bold text-red-600 hover:bg-red-50">
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Cancel order {orderNumber}?</DialogTitle>
          <DialogDescription>
            Items go back to the store&apos;s stock and any pending payment is cancelled. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <Textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={255} placeholder="Reason (optional)" aria-label="Cancellation reason" className="rounded-xl text-sm" />
        <InlineError error={cancel.error} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-full">Keep Order</Button>
          <Button
            disabled={cancel.isPending}
            onClick={() =>
              cancel.mutate(
                { orderNumber, reason: reason.trim() || undefined },
                {
                  onSuccess: () => {
                    setOpen(false);
                    toast.success("Order cancelled", orderNumber);
                  },
                }
              )
            }
            className="rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            {cancel.isPending ? "Cancelling…" : "Cancel Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
