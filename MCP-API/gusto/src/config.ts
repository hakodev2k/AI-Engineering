import { z } from "zod";

const Env = z.object({
  GUSTO_ACCESS_TOKEN: z.string().min(1),
  GUSTO_REFRESH_TOKEN: z.string().optional(),
  GUSTO_CLIENT_ID: z.string().optional(),
  GUSTO_CLIENT_SECRET: z.string().optional(),
  GUSTO_REDIRECT_URI: z.string().url().optional(),
  GUSTO_BASE_URL: z.string().url().default("https://api.gusto-demo.com"),
  GUSTO_API_VERSION: z.literal("2026-06-15").default("2026-06-15"),
  GUSTO_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  GUSTO_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  GUSTO_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  GUSTO_APPROVED_ACTIONS: z.string().default("")
});

function validateBaseUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("Gusto base URL must use HTTPS.");
  if (!new Set(["api.gusto.com", "api.gusto-demo.com"]).has(url.hostname)) {
    throw new Error("Gusto base URL must use an official Gusto API host.");
  }
  return url.toString().replace(/\/$/, "");
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const value = Env.parse(env);
  const refreshConfigured = Boolean(value.GUSTO_REFRESH_TOKEN || value.GUSTO_CLIENT_ID || value.GUSTO_CLIENT_SECRET);
  if (refreshConfigured && !(value.GUSTO_REFRESH_TOKEN && value.GUSTO_CLIENT_ID && value.GUSTO_CLIENT_SECRET)) {
    throw new Error("Gusto token refresh requires GUSTO_REFRESH_TOKEN, GUSTO_CLIENT_ID, and GUSTO_CLIENT_SECRET together.");
  }
  return {
    accessToken: value.GUSTO_ACCESS_TOKEN,
    refreshToken: value.GUSTO_REFRESH_TOKEN,
    clientId: value.GUSTO_CLIENT_ID,
    clientSecret: value.GUSTO_CLIENT_SECRET,
    redirectUri: value.GUSTO_REDIRECT_URI,
    baseUrl: validateBaseUrl(value.GUSTO_BASE_URL),
    apiVersion: value.GUSTO_API_VERSION,
    timeoutMs: value.GUSTO_TIMEOUT_MS,
    maxRetries: value.GUSTO_MAX_RETRIES,
    requireWriteApproval: value.GUSTO_REQUIRE_WRITE_APPROVAL === "true",
    approvedActions: new Set(value.GUSTO_APPROVED_ACTIONS.split(";").map((x) => x.trim()).filter(Boolean))
  };
}

export type Config = ReturnType<typeof loadConfig>;
