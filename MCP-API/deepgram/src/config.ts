import { z } from 'zod';

const EnvSchema = z.object({
  DEEPGRAM_API_KEY: z.string().min(1),
  DEEPGRAM_API_BASE_URL: z.string().url().default('https://api.deepgram.com'),
  DEEPGRAM_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  DEEPGRAM_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  DEEPGRAM_APPROVED_ACTIONS: z.string().default(''),
  DEEPGRAM_MAX_AUDIO_BYTES: z.coerce.number().int().min(1024).max(25 * 1024 * 1024).default(8 * 1024 * 1024)
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  const base = new URL(parsed.DEEPGRAM_API_BASE_URL);
  if (base.protocol !== 'https:') throw new Error('CONFIG_ERROR: DEEPGRAM_API_BASE_URL must use HTTPS');
  return {
    apiKey: parsed.DEEPGRAM_API_KEY,
    baseUrl: base.toString().replace(/\/$/, ''),
    timeoutMs: parsed.DEEPGRAM_TIMEOUT_MS,
    approvalMode: parsed.DEEPGRAM_APPROVAL_MODE,
    approvedActions: new Set(parsed.DEEPGRAM_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    maxAudioBytes: parsed.DEEPGRAM_MAX_AUDIO_BYTES
  };
}

export function assertApproval(config: Config, action: string) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to DEEPGRAM_APPROVED_ACTIONS`);
  }
}
