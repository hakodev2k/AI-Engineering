import { z } from "zod";

const envSchema = z.object({
  RECURLY_API_KEY: z.string().min(1),
  RECURLY_SITE_SUBDOMAIN: z.string().regex(/^[a-z0-9][a-z0-9-]{0,62}$/i),
  RECURLY_API_VERSION: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default("2021-02-25"),
  RECURLY_PERMISSIONS: z.enum(["read", "write", "high-risk"]).default("read"),
  RECURLY_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  RECURLY_REQUIRE_HIGH_RISK_APPROVAL: z.enum(["true", "false"]).default("true"),
  RECURLY_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  RECURLY_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2)
});

export type Config = {
  apiKey: string;
  siteSubdomain: string;
  apiVersion: string;
  permission: "read" | "write" | "high-risk";
  requireWriteApproval: boolean;
  requireHighRiskApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const value = envSchema.parse(env);
  return {
    apiKey: value.RECURLY_API_KEY,
    siteSubdomain: value.RECURLY_SITE_SUBDOMAIN,
    apiVersion: value.RECURLY_API_VERSION,
    permission: value.RECURLY_PERMISSIONS,
    requireWriteApproval: value.RECURLY_REQUIRE_WRITE_APPROVAL === "true",
    requireHighRiskApproval: value.RECURLY_REQUIRE_HIGH_RISK_APPROVAL === "true",
    timeoutMs: value.RECURLY_TIMEOUT_MS,
    maxRetries: value.RECURLY_MAX_RETRIES
  };
}
