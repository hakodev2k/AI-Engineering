import { z } from 'zod';

const EnvSchema = z.object({
  HF_TOKEN: z.string().min(1),
  HF_API_BASE_URL: z.string().url().default('https://huggingface.co'),
  HF_INFERENCE_BASE_URL: z.string().url().default('https://router.huggingface.co/v1'),
  HF_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  HF_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  HF_APPROVED_ACTIONS: z.string().default(''),
  HF_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    token: parsed.HF_TOKEN,
    apiBaseUrl: parsed.HF_API_BASE_URL.replace(/\/$/, ''),
    inferenceBaseUrl: parsed.HF_INFERENCE_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.HF_TIMEOUT_MS,
    approvalMode: parsed.HF_APPROVAL_MODE,
    approvedActions: new Set(parsed.HF_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.HF_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to HF_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set HF_ALLOW_DESTRUCTIVE=true only after explicit human approval');
  }
}
