import { z } from 'zod';

const EnvSchema = z.object({
  ZENDESK_SUBDOMAIN: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  ZENDESK_OAUTH_ACCESS_TOKEN: z.string().min(1),
  ZENDESK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  ZENDESK_APPROVAL_MODE: z.enum(['required','disabled']).default('required'),
  ZENDESK_APPROVED_ACTIONS: z.string().default(''),
  ZENDESK_ALLOW_DESTRUCTIVE: z.enum(['true','false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const p = EnvSchema.parse(env);
  return {
    subdomain: p.ZENDESK_SUBDOMAIN,
    accessToken: p.ZENDESK_OAUTH_ACCESS_TOKEN,
    baseUrl: `https://${p.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`,
    timeoutMs: p.ZENDESK_TIMEOUT_MS,
    approvalMode: p.ZENDESK_APPROVAL_MODE,
    approvedActions: new Set(p.ZENDESK_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: p.ZENDESK_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) throw new Error(`APPROVAL_REQUIRED: ${action}`);
  if (destructive && !config.allowDestructive) throw new Error('DESTRUCTIVE_DISABLED');
}
