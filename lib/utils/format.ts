export function formatCurrency(amount: number | null | undefined, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount ?? 0);
}

export function formatShortDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Plain text from the HTML descriptions the merchant backend stores. */
export function stripHtml(value: string | null | undefined) {
  return (value ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export function formatAddressLines(address: {
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country?: string | null;
}) {
  return [
    [address.line1, address.line2].filter(Boolean).join(", "),
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country ?? "",
  ].filter(Boolean);
}
