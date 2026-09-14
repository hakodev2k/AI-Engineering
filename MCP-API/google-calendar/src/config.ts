import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_REFRESH_TOKEN: z.string().min(1).optional(),
  GOOGLE_ACCESS_TOKEN: z.string().min(1).optional(),
  GOOGLE_CALENDAR_MCP_URL: z.string().url().default('https://calendarmcp.googleapis.com/mcp/v1'),
  GOOGLE_CALENDAR_API_BASE_URL: z.string().url().default('https://www.googleapis.com/calendar/v3'),
  GOOGLE_OAUTH_TOKEN_URL: z.string().url().default('https://oauth2.googleapis.com/token'),
  GOOGLE_CALENDAR_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  GOOGLE_CALENDAR_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  GOOGLE_CALENDAR_APPROVAL_SECRET: z.string().min(32).optional()
});

export type Config = ReturnType<typeof loadConfig>;

function assertHost(url: string, expectedHost: string) {
  if (new URL(url).hostname !== expectedHost) throw new Error(`Refusing unexpected upstream host for ${expectedHost}`);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = envSchema.parse(env);
  if (!v.GOOGLE_ACCESS_TOKEN && !(v.GOOGLE_CLIENT_ID && v.GOOGLE_CLIENT_SECRET && v.GOOGLE_REFRESH_TOKEN)) {
    throw new Error('Configure GOOGLE_ACCESS_TOKEN or OAuth client_id/client_secret/refresh_token');
  }
  assertHost(v.GOOGLE_CALENDAR_MCP_URL, 'calendarmcp.googleapis.com');
  assertHost(v.GOOGLE_CALENDAR_API_BASE_URL, 'www.googleapis.com');
  assertHost(v.GOOGLE_OAUTH_TOKEN_URL, 'oauth2.googleapis.com');
  return {
    clientId: v.GOOGLE_CLIENT_ID,
    clientSecret: v.GOOGLE_CLIENT_SECRET,
    refreshToken: v.GOOGLE_REFRESH_TOKEN,
    accessToken: v.GOOGLE_ACCESS_TOKEN,
    mcpUrl: v.GOOGLE_CALENDAR_MCP_URL,
    apiBaseUrl: v.GOOGLE_CALENDAR_API_BASE_URL.replace(/\/$/, ''),
    tokenUrl: v.GOOGLE_OAUTH_TOKEN_URL,
    timeoutMs: v.GOOGLE_CALENDAR_TIMEOUT_MS,
    maxRetries: v.GOOGLE_CALENDAR_MAX_RETRIES,
    approvalSecret: v.GOOGLE_CALENDAR_APPROVAL_SECRET
  };
}
