import { z } from 'zod';

const EnvSchema = z.object({
  INTERCOM_ACCESS_TOKEN: z.string().min(1),
  INTERCOM_API_BASE_URL: z.string().url().default('https://api.intercom.io'),
  INTERCOM_API_VERSION: z.string().regex(/^\d+\.\d+$/).default('2.16'),
  INTERCOM_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  INTERCOM_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  INTERCOM_APPROVED_ACTIONS: z.string().default(''),
  INTERCOM_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  const base = new URL(parsed.INTERCOM_API_BASE_URL);
  if (base.protocol !== 'https:') throw new Error('CONFIG_ERROR: INTERCOM_API_BASE_URL must use HTTPS');
  return {
    accessToken: parsed.INTERCOM_ACCESS_TOKEN,
    baseUrl: parsed.INTERCOM_API_BASE_URL.replace(/\/$/, ''),
    apiVersion: parsed.INTERCOM_API_VERSION,
    timeoutMs: parsed.INTERCOM_TIMEOUT_MS,
    approvalMode: parsed.INTERCOM_APPROVAL_MODE,
    approvedActions: new Set(parsed.INTERCOM_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.INTERCOM_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to INTERCOM_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set INTERCOM_ALLOW_DESTRUCTIVE=true only after explicit human approval');
  }
}
