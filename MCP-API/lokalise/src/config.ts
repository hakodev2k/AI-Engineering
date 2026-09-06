import { z } from "zod";

const envSchema = z.object({
  LOKALISE_OAUTH_TOKEN: z.string().min(1).optional(),
  LOKALISE_API_TOKEN: z.string().min(1).optional(),
  LOKALISE_PERMISSIONS: z.string().default("read"),
  LOKALISE_REQUIRE_WRITE_APPROVAL: z.string().default("true"),
  LOKALISE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  LOKALISE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2)
});

export type Config = ReturnType<typeof loadConfig>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const e = envSchema.parse(env);
  if (!e.LOKALISE_OAUTH_TOKEN && !e.LOKALISE_API_TOKEN) throw new Error("Set LOKALISE_OAUTH_TOKEN or LOKALISE_API_TOKEN.");
  const permissions = new Set(e.LOKALISE_PERMISSIONS.split(",").map(x => x.trim().toLowerCase()).filter(Boolean));
  if (![...permissions].every(x => ["read","write"].includes(x))) throw new Error("LOKALISE_PERMISSIONS accepts only read,write.");
  return { oauthToken:e.LOKALISE_OAUTH_TOKEN, apiToken:e.LOKALISE_API_TOKEN, permissions, requireWriteApproval:e.LOKALISE_REQUIRE_WRITE_APPROVAL.toLowerCase() !== "false", timeoutMs:e.LOKALISE_TIMEOUT_MS, maxRetries:e.LOKALISE_MAX_RETRIES };
}
