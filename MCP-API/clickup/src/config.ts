import { z } from 'zod';

const EnvSchema = z.object({
  CLICKUP_ACCESS_TOKEN: z.string().min(1),
  CLICKUP_API_BASE_URL: z.string().url().default('https://api.clickup.com/api/v2'),
  CLICKUP_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  CLICKUP_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  CLICKUP_APPROVED_ACTIONS: z.string().default(''),
  CLICKUP_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    accessToken: parsed.CLICKUP_ACCESS_TOKEN,
    baseUrl: parsed.CLICKUP_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.CLICKUP_TIMEOUT_MS,
    approvalMode: parsed.CLICKUP_APPROVAL_MODE,
    approvedActions: new Set(parsed.CLICKUP_APPROVED_ACTIONS.split(',').map(v => v.trim()).filter(Boolean)),
    allowDestructive: parsed.CLICKUP_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to CLICKUP_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set CLICKUP_ALLOW_DESTRUCTIVE=true after explicit human approval');
  }
}
