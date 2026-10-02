"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Product/media image with a neutral placeholder when the URL is missing or fails to load. */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div className={cn("flex items-center justify-center overflow-hidden bg-slate-50", className)}>
      {showImage ? (
        // Images are served by the merchant backend's storage (MEDIA_URL), which next/image is not configured for.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          loading="lazy"
          className={cn("h-full w-full object-contain", imgClassName)}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <ImageOff aria-label={alt} className="h-1/3 max-h-10 w-1/3 max-w-10 text-slate-300" />
      )}
    </div>
  );
}
