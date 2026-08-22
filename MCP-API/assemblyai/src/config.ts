import { z } from 'zod';

const EnvSchema = z.object({
  ASSEMBLYAI_API_KEY: z.string().min(1),
  ASSEMBLYAI_API_BASE_URL: z.string().url().default('https://api.assemblyai.com'),
  ASSEMBLYAI_LLM_BASE_URL: z.string().url().default('https://llm-gateway.assemblyai.com'),
  ASSEMBLYAI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  ASSEMBLYAI_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  ASSEMBLYAI_APPROVED_ACTIONS: z.string().default(''),
  ASSEMBLYAI_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const p = EnvSchema.parse(env);
  return {
    apiKey: p.ASSEMBLYAI_API_KEY,
    apiBaseUrl: p.ASSEMBLYAI_API_BASE_URL.replace(/\/$/, ''),
    llmBaseUrl: p.ASSEMBLYAI_LLM_BASE_URL.replace(/\/$/, ''),
    timeoutMs: p.ASSEMBLYAI_TIMEOUT_MS,
    approvalMode: p.ASSEMBLYAI_APPROVAL_MODE,
    approvedActions: new Set(p.ASSEMBLYAI_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: p.ASSEMBLYAI_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertActionAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must approve ${action} outside the model request`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: explicit operator enablement is required');
  }
}
