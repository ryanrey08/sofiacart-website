"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">Application error</h1>
          <p className="text-sm text-muted-foreground">
            The storefront shell failed to load. Please retry the request.
          </p>
          <Button onClick={reset}>Reload</Button>
        </div>
      </body>
    </html>
  );
}
