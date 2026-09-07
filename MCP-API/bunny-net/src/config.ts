import { z } from 'zod';

const ConfigSchema = z.object({
  apiKey: z.string().min(1),
  apiBaseUrl: z.string().url().default('https://api.bunny.net'),
  timeoutMs: z.number().int().min(1000).max(120000).default(15000),
  maxRetries: z.number().int().min(0).max(5).default(3),
  approvalMode: z.enum(['required', 'optional']).default('required'),
  allowDestructive: z.boolean().default(false),
});

export type BunnyConfig = z.infer<typeof ConfigSchema>;

function boolEnv(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === '') return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean environment value: ${value}`);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BunnyConfig {
  return ConfigSchema.parse({
    apiKey: env.BUNNYNET_API_KEY,
    apiBaseUrl: env.BUNNYNET_API_BASE_URL || 'https://api.bunny.net',
    timeoutMs: Number(env.BUNNYNET_TIMEOUT_MS || 15000),
    maxRetries: Number(env.BUNNYNET_MAX_RETRIES || 3),
    approvalMode: env.BUNNYNET_APPROVAL_MODE || 'required',
    allowDestructive: boolEnv(env.BUNNYNET_ALLOW_DESTRUCTIVE, false),
  });
}
