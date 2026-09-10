import { z } from "zod";

const envSchema = z.object({
  HELPSCOUT_ACCESS_TOKEN: z.string().min(1).optional(),
  HELPSCOUT_CLIENT_ID: z.string().min(1).optional(),
  HELPSCOUT_CLIENT_SECRET: z.string().min(1).optional(),
  HELPSCOUT_API_BASE: z.string().url().default("https://api.helpscout.net"),
  HELPSCOUT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  HELPSCOUT_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  HELPSCOUT_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  HELPSCOUT_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  HELPSCOUT_ALLOW_HIGH_RISK: z.enum(["true", "false"]).default("false"),
  HELPSCOUT_WEBHOOK_SECRET: z.string().min(8).max(40).optional()
});

export type HelpScoutConfig = {
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  apiBase: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrite: boolean;
  requireWriteApproval: boolean;
  allowHighRisk: boolean;
  webhookSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): HelpScoutConfig {
  const value = envSchema.parse(env);
  if (!value.HELPSCOUT_ACCESS_TOKEN && !(value.HELPSCOUT_CLIENT_ID && value.HELPSCOUT_CLIENT_SECRET)) {
    throw new Error("Set HELPSCOUT_ACCESS_TOKEN or both HELPSCOUT_CLIENT_ID and HELPSCOUT_CLIENT_SECRET");
  }
  const base = new URL(value.HELPSCOUT_API_BASE);
  if (base.protocol !== "https:") throw new Error("HELPSCOUT_API_BASE must use HTTPS");
  return {
    accessToken: value.HELPSCOUT_ACCESS_TOKEN,
    clientId: value.HELPSCOUT_CLIENT_ID,
    clientSecret: value.HELPSCOUT_CLIENT_SECRET,
    apiBase: base.origin,
    timeoutMs: value.HELPSCOUT_TIMEOUT_MS,
    maxRetries: value.HELPSCOUT_MAX_RETRIES,
    allowWrite: value.HELPSCOUT_ALLOW_WRITE === "true",
    requireWriteApproval: value.HELPSCOUT_REQUIRE_WRITE_APPROVAL === "true",
    allowHighRisk: value.HELPSCOUT_ALLOW_HIGH_RISK === "true",
    webhookSecret: value.HELPSCOUT_WEBHOOK_SECRET
  };
}
