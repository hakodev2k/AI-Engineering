import { z } from "zod";

const EnvSchema = z.object({
  HELPSCOUT_ACCESS_TOKEN: z.string().min(1).optional(),
  HELPSCOUT_APP_ID: z.string().min(1).optional(),
  HELPSCOUT_APP_SECRET: z.string().min(1).optional(),
  HELPSCOUT_API_BASE: z.string().url().default("https://api.helpscout.net"),
  HELPSCOUT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  HELPSCOUT_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  HELPSCOUT_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  HELPSCOUT_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false"),
  HELPSCOUT_APPROVED_ACTIONS: z.string().default(""),
  HELPSCOUT_WEBHOOK_SECRET: z.string().min(1).max(40).optional()
});

function validateApiBase(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "api.helpscout.net") {
    throw new Error("HELPSCOUT_API_BASE must be https://api.helpscout.net");
  }
  return url.toString().replace(/\/$/, "");
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  const hasStatic = Boolean(parsed.HELPSCOUT_ACCESS_TOKEN);
  const hasClientCredentials = Boolean(parsed.HELPSCOUT_APP_ID && parsed.HELPSCOUT_APP_SECRET);
  if (!hasStatic && !hasClientCredentials) {
    throw new Error("Configure HELPSCOUT_ACCESS_TOKEN or both HELPSCOUT_APP_ID and HELPSCOUT_APP_SECRET.");
  }
  if (Boolean(parsed.HELPSCOUT_APP_ID) !== Boolean(parsed.HELPSCOUT_APP_SECRET)) {
    throw new Error("HELPSCOUT_APP_ID and HELPSCOUT_APP_SECRET must be configured together.");
  }
  return {
    accessToken: parsed.HELPSCOUT_ACCESS_TOKEN,
    appId: parsed.HELPSCOUT_APP_ID,
    appSecret: parsed.HELPSCOUT_APP_SECRET,
    apiBase: validateApiBase(parsed.HELPSCOUT_API_BASE),
    timeoutMs: parsed.HELPSCOUT_TIMEOUT_MS,
    maxRetries: parsed.HELPSCOUT_MAX_RETRIES,
    requireWriteApproval: parsed.HELPSCOUT_REQUIRE_WRITE_APPROVAL === "true",
    allowDestructive: parsed.HELPSCOUT_ALLOW_DESTRUCTIVE === "true",
    approvedActions: new Set(parsed.HELPSCOUT_APPROVED_ACTIONS.split(";").map(v => v.trim()).filter(Boolean)),
    webhookSecret: parsed.HELPSCOUT_WEBHOOK_SECRET
  };
}

export type Config = ReturnType<typeof loadConfig>;
