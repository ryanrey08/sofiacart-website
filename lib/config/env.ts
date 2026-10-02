import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("SofiaCart"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:8001/api"),
  NEXT_PUBLIC_ENABLE_API_MOCKS: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "SofiaCart",
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001/api",
  NEXT_PUBLIC_ENABLE_API_MOCKS:
    process.env.NEXT_PUBLIC_ENABLE_API_MOCKS ?? "false",
});
