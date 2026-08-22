import { z } from 'zod';

const EnvSchema = z.object({
  PAGERDUTY_API_TOKEN: z.string().min(1),
  PAGERDUTY_API_BASE_URL: z.string().url().default('https://api.pagerduty.com'),
  PAGERDUTY_FROM_EMAIL: z.string().email().optional().or(z.literal('')),
  PAGERDUTY_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  PAGERDUTY_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  PAGERDUTY_APPROVED_ACTIONS: z.string().default(''),
  PAGERDUTY_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiToken: parsed.PAGERDUTY_API_TOKEN,
    baseUrl: parsed.PAGERDUTY_API_BASE_URL.replace(/\/$/, ''),
    fromEmail: parsed.PAGERDUTY_FROM_EMAIL || undefined,
    timeoutMs: parsed.PAGERDUTY_TIMEOUT_MS,
    approvalMode: parsed.PAGERDUTY_APPROVAL_MODE,
    approvedActions: new Set(parsed.PAGERDUTY_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.PAGERDUTY_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to PAGERDUTY_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set PAGERDUTY_ALLOW_DESTRUCTIVE=true after explicit human approval');
  }
}
