import { z } from 'zod';

const EnvSchema = z.object({
  FRESHDESK_DOMAIN: z.string().min(2).max(63).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/i),
  FRESHDESK_API_KEY: z.string().min(8),
  FRESHDESK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  FRESHDESK_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  FRESHDESK_APPROVED_ACTIONS: z.string().default('')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    domain: parsed.FRESHDESK_DOMAIN.toLowerCase(),
    apiKey: parsed.FRESHDESK_API_KEY,
    timeoutMs: parsed.FRESHDESK_TIMEOUT_MS,
    approvalMode: parsed.FRESHDESK_APPROVAL_MODE,
    approvedActions: new Set(parsed.FRESHDESK_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean))
  };
}

export function assertWriteAllowed(config: Config, action: string) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to FRESHDESK_APPROVED_ACTIONS`);
  }
}
