import { z } from 'zod';

const EnvSchema = z.object({
  NEW_RELIC_USER_API_KEY: z.string().min(1),
  NEW_RELIC_REGION: z.enum(['US','EU','JP']).default('US'),
  NEW_RELIC_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  NEW_RELIC_APPROVAL_MODE: z.enum(['required','disabled']).default('required'),
  NEW_RELIC_APPROVED_ACTIONS: z.string().default(''),
  NEW_RELIC_ALLOW_DESTRUCTIVE: z.enum(['true','false']).default('false')
});

const endpoints = {
  US: 'https://api.newrelic.com/graphql',
  EU: 'https://api.eu.newrelic.com/graphql',
  JP: 'https://api.jp.newrelic.com/graphql'
} as const;

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const p = EnvSchema.parse(env);
  return {
    apiKey: p.NEW_RELIC_USER_API_KEY,
    region: p.NEW_RELIC_REGION,
    endpoint: endpoints[p.NEW_RELIC_REGION],
    timeoutMs: p.NEW_RELIC_TIMEOUT_MS,
    approvalMode: p.NEW_RELIC_APPROVAL_MODE,
    approvedActions: new Set(p.NEW_RELIC_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: p.NEW_RELIC_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to NEW_RELIC_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set NEW_RELIC_ALLOW_DESTRUCTIVE=true only after explicit human approval');
  }
}
