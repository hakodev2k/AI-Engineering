import { z } from 'zod';

const EnvSchema = z.object({
  ASANA_ACCESS_TOKEN: z.string().min(1),
  ASANA_API_BASE_URL: z.string().url().default('https://app.asana.com/api/1.0'),
  ASANA_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  ASANA_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  ASANA_APPROVED_ACTIONS: z.string().default(''),
  ASANA_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    accessToken: parsed.ASANA_ACCESS_TOKEN,
    baseUrl: parsed.ASANA_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.ASANA_TIMEOUT_MS,
    approvalMode: parsed.ASANA_APPROVAL_MODE,
    approvedActions: new Set(parsed.ASANA_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.ASANA_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to ASANA_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: explicit operator opt-in is required');
  }
}
