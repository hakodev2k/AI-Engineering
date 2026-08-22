import { z } from 'zod';

const EnvSchema = z.object({
  SUPABASE_ACCESS_TOKEN: z.string().min(1),
  SUPABASE_API_BASE_URL: z.string().url().default('https://api.supabase.com'),
  SUPABASE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  SUPABASE_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  SUPABASE_APPROVED_ACTIONS: z.string().default(''),
  SUPABASE_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    accessToken: parsed.SUPABASE_ACCESS_TOKEN,
    baseUrl: parsed.SUPABASE_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.SUPABASE_TIMEOUT_MS,
    approvalMode: parsed.SUPABASE_APPROVAL_MODE,
    approvedActions: new Set(parsed.SUPABASE_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.SUPABASE_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertActionAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to SUPABASE_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set SUPABASE_ALLOW_DESTRUCTIVE=true after explicit human approval');
  }
}
