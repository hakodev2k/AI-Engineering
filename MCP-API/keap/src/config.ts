import { z } from 'zod';

const bool = (fallback: boolean) => z.string().optional().transform(v => v == null ? fallback : v.toLowerCase() === 'true');

const schema = z.object({
  KEAP_ACCESS_TOKEN: z.string().min(1),
  KEAP_CLIENT_ID: z.string().optional(),
  KEAP_CLIENT_SECRET: z.string().optional(),
  KEAP_REFRESH_TOKEN: z.string().optional(),
  KEAP_API_BASE: z.string().url().default('https://api.infusionsoft.com/crm/rest/v1'),
  KEAP_TOKEN_URL: z.string().url().default('https://api.infusionsoft.com/token'),
  KEAP_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  KEAP_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  KEAP_REQUIRE_WRITE_APPROVAL: bool(true),
  KEAP_DESTRUCTIVE_ENABLED: bool(false)
});

export type KeapConfig = {
  accessToken: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  apiBase: string;
  tokenUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): KeapConfig {
  const v = schema.parse(env);
  const api = new URL(v.KEAP_API_BASE);
  const token = new URL(v.KEAP_TOKEN_URL);
  if (api.protocol !== 'https:' || api.hostname !== 'api.infusionsoft.com') throw new Error('KEAP_API_BASE must use https://api.infusionsoft.com');
  if (token.protocol !== 'https:' || token.hostname !== 'api.infusionsoft.com') throw new Error('KEAP_TOKEN_URL must use https://api.infusionsoft.com');
  return {
    accessToken: v.KEAP_ACCESS_TOKEN,
    clientId: v.KEAP_CLIENT_ID,
    clientSecret: v.KEAP_CLIENT_SECRET,
    refreshToken: v.KEAP_REFRESH_TOKEN,
    apiBase: v.KEAP_API_BASE.replace(/\/$/, ''),
    tokenUrl: v.KEAP_TOKEN_URL,
    timeoutMs: v.KEAP_REQUEST_TIMEOUT_MS,
    maxRetries: v.KEAP_MAX_RETRIES,
    requireWriteApproval: v.KEAP_REQUIRE_WRITE_APPROVAL,
    destructiveEnabled: v.KEAP_DESTRUCTIVE_ENABLED
  };
}
