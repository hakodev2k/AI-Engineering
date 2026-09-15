import { z } from 'zod';

const schema = z.object({
  NTFY_BASE_URL: z.string().url().default('https://ntfy.sh'),
  NTFY_ACCESS_TOKEN: z.string().optional(),
  NTFY_USERNAME: z.string().optional(),
  NTFY_PASSWORD: z.string().optional(),
  NTFY_TIMEOUT_MS: z.coerce.number().int().min(100).max(120000).default(10000),
  NTFY_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  NTFY_REQUIRE_WRITE_APPROVAL: z.enum(['true','false']).default('true'),
  NTFY_ALLOW_EXTERNAL_ACTION_URLS: z.enum(['true','false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = schema.parse(env);
  const url = new URL(v.NTFY_BASE_URL);
  if (url.protocol !== 'https:' && !['localhost','127.0.0.1','::1'].includes(url.hostname)) throw new Error('NTFY_BASE_URL must use HTTPS except localhost');
  if ((v.NTFY_USERNAME && !v.NTFY_PASSWORD) || (!v.NTFY_USERNAME && v.NTFY_PASSWORD)) throw new Error('NTFY_USERNAME and NTFY_PASSWORD must be configured together');
  return {...v, baseUrl:url.origin, requireWriteApproval:v.NTFY_REQUIRE_WRITE_APPROVAL==='true', allowExternalActionUrls:v.NTFY_ALLOW_EXTERNAL_ACTION_URLS==='true'};
}
