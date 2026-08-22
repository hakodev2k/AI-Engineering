import { z } from 'zod';

const EnvSchema = z.object({
  DATADOG_API_KEY: z.string().min(1),
  DATADOG_APPLICATION_KEY: z.string().min(1),
  DATADOG_API_BASE_URL: z.string().url().default('https://api.datadoghq.com'),
  DATADOG_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  DATADOG_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  DATADOG_APPROVED_ACTIONS: z.string().default(''),
  DATADOG_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiKey: parsed.DATADOG_API_KEY,
    applicationKey: parsed.DATADOG_APPLICATION_KEY,
    baseUrl: parsed.DATADOG_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.DATADOG_TIMEOUT_MS,
    approvalMode: parsed.DATADOG_APPROVAL_MODE,
    approvedActions: new Set(parsed.DATADOG_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.DATADOG_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to DATADOG_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set DATADOG_ALLOW_DESTRUCTIVE=true after explicit human approval');
  }
}
