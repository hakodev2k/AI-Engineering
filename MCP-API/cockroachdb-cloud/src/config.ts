import { z } from "zod";

const bool = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

const intInRange = (value: string | undefined, fallback: number, min: number, max: number) => {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`Expected integer in range ${min}-${max}`);
  }
  return parsed;
};

const envSchema = z.object({
  COCKROACH_CLOUD_API_KEY: z.string().min(8),
  COCKROACH_CLOUD_API_BASE_URL: z.string().url().default("https://cockroachlabs.cloud/api/v1"),
  COCKROACH_CLOUD_TIMEOUT_MS: z.string().optional(),
  COCKROACH_CLOUD_MAX_RETRIES: z.string().optional(),
  COCKROACH_CLOUD_REQUIRE_WRITE_APPROVAL: z.string().optional(),
  COCKROACH_CLOUD_ALLOW_DESTRUCTIVE: z.string().optional(),
  COCKROACH_CLOUD_APPROVAL_SECRET: z.string().optional()
});

export type ConnectorConfig = {
  apiKey: string;
  apiBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  allowDestructive: boolean;
  approvalSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const parsed = envSchema.parse(env);
  const url = new URL(parsed.COCKROACH_CLOUD_API_BASE_URL);
  if (url.protocol !== "https:" || url.hostname !== "cockroachlabs.cloud" || !url.pathname.startsWith("/api/v1")) {
    throw new Error("COCKROACH_CLOUD_API_BASE_URL must use the official https://cockroachlabs.cloud/api/v1 origin");
  }

  return {
    apiKey: parsed.COCKROACH_CLOUD_API_KEY,
    apiBaseUrl: parsed.COCKROACH_CLOUD_API_BASE_URL.replace(/\/$/, ""),
    timeoutMs: intInRange(parsed.COCKROACH_CLOUD_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: intInRange(parsed.COCKROACH_CLOUD_MAX_RETRIES, 2, 0, 5),
    requireWriteApproval: bool(parsed.COCKROACH_CLOUD_REQUIRE_WRITE_APPROVAL, true),
    allowDestructive: bool(parsed.COCKROACH_CLOUD_ALLOW_DESTRUCTIVE, false),
    approvalSecret: parsed.COCKROACH_CLOUD_APPROVAL_SECRET
  };
}
