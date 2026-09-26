import { env } from "@/lib/config/env";

export const siteConfig = {
  appName: env.NEXT_PUBLIC_APP_NAME,
  description:
    "Production-ready SofiaCart frontend foundation built with Next.js, Tailwind, shadcn-style UI primitives, Zustand, and TanStack Query.",
  supportEmail: "support@sofiacart.com",
} as const;
