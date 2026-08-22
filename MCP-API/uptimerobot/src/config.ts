import { z } from 'zod';

const EnvSchema = z.object({
  UPTIMEROBOT_API_KEY: z.string().min(1),
  UPTIMEROBOT_API_BASE_URL: z.string().url().default('https://api.uptimerobot.com/v3'),
  UPTIMEROBOT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  UPTIMEROBOT_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  UPTIMEROBOT_APPROVED_ACTIONS: z.string().default(''),
  UPTIMEROBOT_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiKey: parsed.UPTIMEROBOT_API_KEY,
    baseUrl: parsed.UPTIMEROBOT_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.UPTIMEROBOT_TIMEOUT_MS,
    approvalMode: parsed.UPTIMEROBOT_APPROVAL_MODE,
    approvedActions: new Set(parsed.UPTIMEROBOT_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.UPTIMEROBOT_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to UPTIMEROBOT_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set UPTIMEROBOT_ALLOW_DESTRUCTIVE=true only after explicit human approval');
  }
}
