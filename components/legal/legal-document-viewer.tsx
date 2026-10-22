"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAFE_LINK = /^(https?:|mailto:|tel:|#)/i;

// List markers from Word's Symbol/Wingdings fonts use private-use code points browsers can't draw;
// swap only those marker glyphs for standard bullets (the document text itself is untouched).
const MARKER_GLYPHS: Array<[RegExp, string]> = [
  [/\uF0B7/g, "\u2022"],
  [/\uF0A7/g, "\u25AA"],
  [/\uF0D8/g, "\u27A2"],
  [/\uF0FC/g, "\u2713"],
];

function fixListMarkers(container: HTMLElement) {
  container.querySelectorAll("style").forEach((style) => {
    let css = style.textContent ?? "";
    if (!/font-family:\s*(Symbol|Wingdings)/i.test(css)) return;
    for (const [glyph, replacement] of MARKER_GLYPHS) css = css.replace(glyph, replacement);
    style.textContent = css.replace(/font-family:\s*(Symbol|Wingdings);?/gi, "");
  });
}

// Word pages render at their printed width (e.g. A4); scale them down to fit narrow screens.
function fitDocxToWidth(container: HTMLElement) {
  const wrapper = container.querySelector<HTMLElement>(".docx-wrapper");
  const page = wrapper?.querySelector<HTMLElement>("section.docx");
  if (!wrapper || !page) return;
  wrapper.style.removeProperty("zoom");
  const available = container.clientWidth;
  const needed = page.offsetWidth + 32;
  if (needed > available) wrapper.style.setProperty("zoom", String(Math.max(0.3, available / needed)));
}

/**
 * Shows a legal document exactly as published: PDFs in the browser's PDF viewer, Word (.docx)
 * files rendered from the file itself with docx-preview (the text is never retyped). Give it a
 * `key` per document so a new version starts from a fresh loading state.
 */
export function LegalDocumentViewer({
  load,
  format,
  title,
  className,
}: {
  load: () => Promise<Blob>;
  format: "pdf" | "docx";
  title: string;
  className?: string;
}) {
  const docxRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const container = docxRef.current;
    if (format !== "docx" || !container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fitDocxToWidth(container));
    observer.observe(container);
    return () => observer.disconnect();
  }, [format]);

  useEffect(() => {
    let active = true;
    let url = "";

    load()
      .then(async (blob) => {
        if (!active) return;

        if (format === "pdf") {
          url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } else if (docxRef.current) {
          const { renderAsync } = await import("docx-preview");
          if (!active || !docxRef.current) return;
          docxRef.current.innerHTML = "";
          await renderAsync(blob, docxRef.current, undefined, {
            className: "docx",
            inWrapper: true,
            breakPages: true,
            ignoreLastRenderedPageBreak: true,
            renderHeaders: true,
            renderFooters: true,
          });
          fixListMarkers(docxRef.current);
          fitDocxToWidth(docxRef.current);
          // Links inside an uploaded file must not run script.
          docxRef.current.querySelectorAll("a[href]").forEach((anchor) => {
            const href = anchor.getAttribute("href") ?? "";
            if (!SAFE_LINK.test(href.trim())) anchor.removeAttribute("href");
            else if (!href.startsWith("#")) {
              anchor.setAttribute("target", "_blank");
              anchor.setAttribute("rel", "noopener noreferrer");
            }
          });
        }

        if (active) setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
    // `load` identity changes every render; the attempt counter drives explicit retries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, format]);

  return (
    <div className={cn("space-y-3", className)}>
      {status === "loading" ? (
        <p role="status" className="flex items-center gap-2 py-6 text-sm text-slate-500">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          Loading document…
        </p>
      ) : null}
      {status === "error" ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3 text-sm text-slate-700">
          <span>The document could not be displayed here. You can still open or download it.</span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => {
              setStatus("loading");
              setAttempt((value) => value + 1);
            }}
          >
            Try again
          </Button>
        </div>
      ) : null}

      {format === "pdf" ? (
        status === "ready" && pdfUrl ? (
          <iframe title={title} src={pdfUrl} className="h-[75vh] min-h-[480px] w-full rounded-2xl border border-slate-200 bg-slate-50" />
        ) : null
      ) : (
        <div
          role="document"
          aria-label={title}
          tabIndex={0}
          className={cn(
            "legal-docx max-h-[75vh] min-h-[240px] overflow-auto rounded-2xl border border-slate-200 bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            status !== "ready" && "hidden"
          )}
        >
          <div ref={docxRef} />
        </div>
      )}
    </div>
  );
}
