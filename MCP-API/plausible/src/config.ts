import { z } from "zod";

const schema = z.object({
  PLAUSIBLE_STATS_API_KEY: z.string().optional().default(""),
  PLAUSIBLE_SITES_API_KEY: z.string().optional().default(""),
  PLAUSIBLE_BASE_URL: z.string().url().default("https://plausible.io"),
  PLAUSIBLE_ALLOW_CUSTOM_BASE_URL: z.enum(["true", "false"]).default("false"),
  PLAUSIBLE_ALLOWED_SITES: z.string().default(""),
  PLAUSIBLE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  PLAUSIBLE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  PLAUSIBLE_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  PLAUSIBLE_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false"),
  PLAUSIBLE_APPROVED_ACTIONS: z.string().default("")
});

function validateBaseUrl(raw: string, allowCustom: boolean) {
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new Error("PLAUSIBLE_BASE_URL must use HTTPS.");
  if (url.username || url.password) throw new Error("PLAUSIBLE_BASE_URL must not contain credentials.");
  if (!allowCustom && url.hostname !== "plausible.io") {
    throw new Error("Custom Plausible hosts require PLAUSIBLE_ALLOW_CUSTOM_BASE_URL=true.");
  }
  return url.toString().replace(/\/$/, "");
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = schema.parse(env);
  const allowCustom = v.PLAUSIBLE_ALLOW_CUSTOM_BASE_URL === "true";
  return {
    statsApiKey: v.PLAUSIBLE_STATS_API_KEY,
    sitesApiKey: v.PLAUSIBLE_SITES_API_KEY,
    baseUrl: validateBaseUrl(v.PLAUSIBLE_BASE_URL, allowCustom),
    allowedSites: new Set(v.PLAUSIBLE_ALLOWED_SITES.split(",").map(x => x.trim()).filter(Boolean)),
    timeoutMs: v.PLAUSIBLE_TIMEOUT_MS,
    maxRetries: v.PLAUSIBLE_MAX_RETRIES,
    requireWriteApproval: v.PLAUSIBLE_REQUIRE_WRITE_APPROVAL === "true",
    allowDestructive: v.PLAUSIBLE_ALLOW_DESTRUCTIVE === "true",
    approvedActions: new Set(v.PLAUSIBLE_APPROVED_ACTIONS.split(";").map(x => x.trim()).filter(Boolean))
  };
}

export type Config = ReturnType<typeof loadConfig>;
