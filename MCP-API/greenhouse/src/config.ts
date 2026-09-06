import { z } from "zod";

const schema = z.object({
  GREENHOUSE_CLIENT_ID: z.string().min(1),
  GREENHOUSE_CLIENT_SECRET: z.string().min(1),
  GREENHOUSE_SUB_USER_ID: z.string().regex(/^\d+$/).optional(),
  GREENHOUSE_API_BASE_URL: z.string().url().default("https://harvest.greenhouse.io"),
  GREENHOUSE_AUTH_BASE_URL: z.string().url().default("https://auth.greenhouse.io"),
  GREENHOUSE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  GREENHOUSE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  GREENHOUSE_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  GREENHOUSE_APPROVED_ACTIONS: z.string().default("")
});

function officialUrl(raw: string, expectedHost: string): string {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.hostname !== expectedHost) {
    throw new Error(`URL must use https://${expectedHost}`);
  }
  return url.toString().replace(/\/$/, "");
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = schema.parse(env);
  return {
    clientId: v.GREENHOUSE_CLIENT_ID,
    clientSecret: v.GREENHOUSE_CLIENT_SECRET,
    subUserId: v.GREENHOUSE_SUB_USER_ID,
    apiBaseUrl: officialUrl(v.GREENHOUSE_API_BASE_URL, "harvest.greenhouse.io"),
    authBaseUrl: officialUrl(v.GREENHOUSE_AUTH_BASE_URL, "auth.greenhouse.io"),
    timeoutMs: v.GREENHOUSE_TIMEOUT_MS,
    maxRetries: v.GREENHOUSE_MAX_RETRIES,
    requireWriteApproval: v.GREENHOUSE_REQUIRE_WRITE_APPROVAL === "true",
    approvedActions: new Set(v.GREENHOUSE_APPROVED_ACTIONS.split(";").map(x => x.trim()).filter(Boolean))
  };
}

export type Config = ReturnType<typeof loadConfig>;
