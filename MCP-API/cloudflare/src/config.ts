import { z } from 'zod';

const EnvSchema = z.object({
  CLOUDFLARE_API_TOKEN: z.string().min(1),
  CLOUDFLARE_API_BASE_URL: z.string().url().default('https://api.cloudflare.com/client/v4'),
  CLOUDFLARE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  CLOUDFLARE_ALLOWED_WRITE_ZONE_IDS: z.string().default(''),
  CLOUDFLARE_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  CLOUDFLARE_APPROVED_ACTIONS: z.string().default(''),
  CLOUDFLARE_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiToken: parsed.CLOUDFLARE_API_TOKEN,
    baseUrl: parsed.CLOUDFLARE_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.CLOUDFLARE_TIMEOUT_MS,
    allowedWriteZoneIds: new Set(parsed.CLOUDFLARE_ALLOWED_WRITE_ZONE_IDS.split(',').map(x => x.trim()).filter(Boolean)),
    approvalMode: parsed.CLOUDFLARE_APPROVAL_MODE,
    approvedActions: new Set(parsed.CLOUDFLARE_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.CLOUDFLARE_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, zoneId: string, action: string, destructive = false) {
  if (!config.allowedWriteZoneIds.has(zoneId)) throw new Error(`WRITE_DENIED: zone ${zoneId} is not in CLOUDFLARE_ALLOWED_WRITE_ZONE_IDS`);
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to CLOUDFLARE_APPROVED_ACTIONS`);
  if (destructive && !config.allowDestructive) throw new Error('DESTRUCTIVE_DISABLED: set CLOUDFLARE_ALLOW_DESTRUCTIVE=true after explicit human approval');
}
