import { z } from 'zod';

const Env = z.object({
  HEALTHCHECKS_API_KEY: z.string().min(1),
  HEALTHCHECKS_API_BASE: z.string().url().default('https://healthchecks.io/api/v3'),
  HEALTHCHECKS_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(10000),
  HEALTHCHECKS_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  HEALTHCHECKS_APPROVAL_MODE: z.enum(['none','write','all']).default('write')
});

export type Config = z.infer<typeof Env>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return Env.parse(env);
}
