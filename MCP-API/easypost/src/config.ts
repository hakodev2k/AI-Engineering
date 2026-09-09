import { z } from 'zod';

export type EasyPostConfig = {
  apiKey: string;
  apiBase: URL;
  timeoutMs: number;
  maxReadRetries: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
  allowedApiHosts: Set<string>;
};

const bool = (value: string | undefined, fallback: boolean) =>
  value === undefined ? fallback : ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());

export function loadConfig(env: NodeJS.ProcessEnv = process.env): EasyPostConfig {
  const apiKey = z.string().min(8).parse(env.EASYPOST_API_KEY);
  const apiBase = new URL(env.EASYPOST_API_BASE ?? 'https://api.easypost.com/v2');
  const allowedApiHosts = new Set((env.EASYPOST_ALLOWED_API_HOSTS ?? 'api.easypost.com').split(',').map(v => v.trim()).filter(Boolean));
  if (apiBase.protocol !== 'https:' || !allowedApiHosts.has(apiBase.hostname)) {
    throw new Error('EASYPOST_API_BASE must use HTTPS and an allowed host');
  }
  const timeoutMs = z.coerce.number().int().min(1000).max(120000).parse(env.EASYPOST_REQUEST_TIMEOUT_MS ?? 15000);
  const maxReadRetries = z.coerce.number().int().min(0).max(5).parse(env.EASYPOST_MAX_READ_RETRIES ?? 3);
  return {
    apiKey,
    apiBase,
    timeoutMs,
    maxReadRetries,
    requireWriteApproval: bool(env.EASYPOST_REQUIRE_WRITE_APPROVAL, true),
    destructiveEnabled: bool(env.EASYPOST_DESTRUCTIVE_ENABLED, false),
    allowedApiHosts
  };
}
