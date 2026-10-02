"use client";

import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { AddressForm } from "@/components/account/address-form";
import { AddressSummary } from "@/components/account/address-summary";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddresses, useDeleteAddress, useMakeDefaultAddress, useSaveAddress } from "@/hooks/use-account";
import { errorMessage } from "@/lib/api/client";
import { toast } from "@/stores/toast-store";
import type { Address } from "@/types/domain";

export function AddressBook() {
  const addresses = useAddresses();
  const save = useSaveAddress();
  const remove = useDeleteAddress();
  const makeDefault = useMakeDefaultAddress();
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  function close() {
    setEditing(null);
    save.reset();
  }

  return (
    <>
      <AccountPageHeader
        icon={MapPin}
        title="My Addresses"
        description="Manage where your orders are delivered."
        action={
          <Button onClick={() => setEditing("new")} className="rounded-full bg-brand text-xs font-bold">
            <Plus className="h-3.5 w-3.5" /> Add Address
          </Button>
        }
      />

      {addresses.isPending ? (
        <ListSkeleton rows={2} />
      ) : addresses.isError ? (
        <ErrorState error={addresses.error} onRetry={() => void addresses.refetch()} />
      ) : addresses.data.length === 0 ? (
        <EmptyState icon={MapPin} title="No saved addresses" description="Add an address to check out faster." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.data.map((address) => (
            <Card key={address.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                {address.isDefault ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                    <Star className="h-3 w-3 fill-current" /> Default
                  </span>
                ) : null}
                <AddressSummary address={address} />
              </div>
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs" onClick={() => setEditing(address)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                {!address.isDefault ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl text-xs"
                    disabled={makeDefault.isPending}
                    onClick={() =>
                      makeDefault.mutate(address.id, {
                        onSuccess: () => toast.success("Default address updated"),
                        onError: (error) => toast.error("Couldn't update default", errorMessage(error)),
                      })
                    }
                  >
                    Set as default
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-8 rounded-xl text-xs text-red-600 hover:bg-red-50"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (!window.confirm("Delete this address?")) return;
                    remove.mutate(address.id, {
                      onSuccess: () => toast.success("Address deleted"),
                      onError: (error) => toast.error("Couldn't delete address", errorMessage(error)),
                    });
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Add Address" : "Edit Address"}</DialogTitle>
          </DialogHeader>
          {editing !== null ? (
            <AddressForm
              key={editing === "new" ? "new" : editing.id}
              address={editing === "new" ? null : editing}
              pending={save.isPending}
              error={save.error}
              onCancel={close}
              onSubmit={(payload, setServerErrors) =>
                save.mutate(
                  { id: editing === "new" ? undefined : editing.id, payload },
                  {
                    onSuccess: () => {
                      toast.success(editing === "new" ? "Address added" : "Address updated");
                      close();
                    },
                    onError: setServerErrors,
                  }
                )
              }
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
