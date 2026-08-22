import { z } from 'zod';

const EnvSchema = z.object({
  ASSEMBLYAI_API_KEY: z.string().min(1),
  ASSEMBLYAI_API_BASE_URL: z.string().url().default('https://api.assemblyai.com'),
  ASSEMBLYAI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  ASSEMBLYAI_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  ASSEMBLYAI_APPROVED_ACTIONS: z.string().default(''),
  ASSEMBLYAI_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiKey: parsed.ASSEMBLYAI_API_KEY,
    baseUrl: parsed.ASSEMBLYAI_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.ASSEMBLYAI_TIMEOUT_MS,
    approvalMode: parsed.ASSEMBLYAI_APPROVAL_MODE,
    approvedActions: new Set(parsed.ASSEMBLYAI_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.ASSEMBLYAI_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to ASSEMBLYAI_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set ASSEMBLYAI_ALLOW_DESTRUCTIVE=true after explicit human approval');
  }
}
