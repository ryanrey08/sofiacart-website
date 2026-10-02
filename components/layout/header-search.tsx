"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initial);
  const [syncedInitial, setSyncedInitial] = useState(initial);

  // Follow the URL when it changes (e.g. browser back), without an effect.
  if (initial !== syncedInitial) {
    setSyncedInitial(initial);
    setValue(initial);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    router.push(term ? `/products?search=${encodeURIComponent(term)}` : "/products");
  }

  return (
    <form role="search" onSubmit={submit} className="relative flex w-full items-center">
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={100}
        placeholder="Search for products, categories or brands..."
        aria-label="Search products"
        className="h-10 w-full rounded-full border-brand/15 bg-brand/5 pl-4 pr-12 text-xs focus-visible:ring-brand sm:text-sm"
      />
      <Button type="submit" size="icon" aria-label="Search" className="absolute right-1 h-8 w-8 rounded-full bg-brand text-white hover:bg-brand/90">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}

export function HeaderSearchFallback() {
  return <div className="h-10 w-full rounded-full border border-brand/15 bg-brand/5" />;
}
