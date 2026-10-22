"use client";

import { useState } from "react";

/**
 * A store's logo or banner, served by the merchant backend's storage (MEDIA_URL), which next/image
 * is not configured for. Renders nothing if the file is missing, so the layout falls back to the
 * store's name and colors instead of a broken-image icon.
 */
export function StoreImage({ src, className }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // Decorative: the store name is always shown next to it.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={className}
      onError={() => setFailed(true)}
      // The server-rendered image may fail before hydration attaches onError; catch that on mount.
      ref={(node) => {
        if (node?.complete && node.naturalWidth === 0) setFailed(true);
      }}
    />
  );
}
