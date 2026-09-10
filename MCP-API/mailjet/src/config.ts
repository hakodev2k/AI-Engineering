import { z } from "zod";

const schema = z.object({
  MAILJET_API_KEY: z.string().min(1),
  MAILJET_SECRET_KEY: z.string().min(1),
  MAILJET_API_BASE: z.string().url().default("https://api.mailjet.com"),
  MAILJET_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  MAILJET_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  MAILJET_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  MAILJET_ENABLE_DESTRUCTIVE: z.enum(["true", "false"]).default("false")
});

export type Config = {
  apiKey: string; secretKey: string; apiBase: string; timeoutMs: number; maxRetries: number;
  requireWriteApproval: boolean; enableDestructive: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const v = schema.parse(env);
  const url = new URL(v.MAILJET_API_BASE);
  if (url.protocol !== "https:") throw new Error("MAILJET_API_BASE must use HTTPS");
  return { apiKey:v.MAILJET_API_KEY, secretKey:v.MAILJET_SECRET_KEY, apiBase:url.origin,
    timeoutMs:v.MAILJET_TIMEOUT_MS, maxRetries:v.MAILJET_MAX_RETRIES,
    requireWriteApproval:v.MAILJET_REQUIRE_WRITE_APPROVAL === "true",
    enableDestructive:v.MAILJET_ENABLE_DESTRUCTIVE === "true" };
}
