"use client";

import { CalendarDays, Download, ExternalLink, FileWarning, ScrollText } from "lucide-react";
import Link from "next/link";

import { LegalDocumentViewer } from "@/components/legal/legal-document-viewer";
import { ErrorState } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLegalDocuments } from "@/hooks/use-legal";
import { legalService } from "@/lib/api/services/legal";
import type { LegalDocument, LegalDocumentType } from "@/types/domain";

const PAGE_TITLES: Record<LegalDocumentType, string> = {
  terms: "Terms and Conditions",
  privacy: "Data Privacy Policy",
};

const OTHER_PAGE: Record<LegalDocumentType, { href: string; label: string }> = {
  terms: { href: "/privacy-policy", label: "Data Privacy Policy" },
  privacy: { href: "/terms-and-conditions", label: "Terms and Conditions" },
};

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-PH", { dateStyle: "long" }).format(date);
}

export function versionText(document: Pick<LegalDocument, "version" | "versionLabel">) {
  return document.versionLabel ? `Version ${document.versionLabel}` : `Version ${document.version}`;
}

/** Public page for the currently published buyer Terms or Privacy Policy, always read from the API. */
export function LegalDocumentPage({ type }: { type: LegalDocumentType }) {
  const query = useLegalDocuments();
  const document = query.data?.[type] ?? null;
  const title = document?.title ?? PAGE_TITLES[type];
  const effective = formatDate(document?.effectiveDate ?? null);
  const published = formatDate(document?.publishedAt ?? null);
  const other = OTHER_PAGE[type];

  return (
    <article aria-labelledby="legal-title" className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <ScrollText className="h-6 w-6" />
          </span>
          <div className="space-y-1">
            <h1 id="legal-title" className="text-2xl font-black text-ink">
              {title}
            </h1>
            {document ? (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  {effective ? `Effective ${effective}` : published ? `Published ${published}` : null}
                </span>
                {effective && published ? <span>Published {published}</span> : null}
                <span>{versionText(document)}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">SofiaCart buyers</p>
            )}
          </div>
        </div>
        {document ? (
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
                Open
                <span className="sr-only"> {title} in a new tab</span>
              </a>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <a href={document.downloadUrl}>
                <Download aria-hidden="true" className="h-4 w-4" />
                Download {document.format === "pdf" ? "PDF" : "document"}
              </a>
            </Button>
          </div>
        ) : null}
      </header>

      {query.isPending ? (
        <div role="status" aria-label="Loading document" className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-[60vh] w-full rounded-2xl" />
        </div>
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} title={`We couldn't load the ${title}`} />
      ) : document ? (
        <LegalDocumentViewer key={document.id} load={() => legalService.file(document)} format={document.format} title={`${title}, ${versionText(document)}`} />
      ) : (
        <div role="status" className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <FileWarning aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-ink">The {title} is temporarily unavailable</p>
          <p className="mx-auto max-w-md text-xs text-slate-500">
            We&apos;re updating this document. Please check back shortly. New account registration is paused until it is available again.
          </p>
        </div>
      )}

      <p className="text-xs text-slate-500">
        See also the{" "}
        <Link href={other.href} className="font-semibold text-brand hover:underline">
          {other.label}
        </Link>
        .
      </p>
    </article>
  );
}
