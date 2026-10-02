import { env } from "@/lib/config/env";

export const siteConfig = {
  appName: env.NEXT_PUBLIC_APP_NAME,
  tagline: "Everything. In One Cart.",
  description: "Shop electronics, fashion, home essentials and more from trusted SofiaCart stores.",
} as const;
