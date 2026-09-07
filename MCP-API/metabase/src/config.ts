import { z } from 'zod';

const Env = z.object({
  METABASE_BASE_URL: z.string().url(),
  METABASE_API_KEY: z.string().min(16),
  METABASE_TIMEOUT_MS: z.coerce.number().int().positive().max(120000).default(15000),
  METABASE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  METABASE_REQUIRE_WRITE_APPROVAL: z.string().default('true').transform(v => v !== 'false')
});

export type Config = z.infer<typeof Env>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = Env.parse(env);
  const u = new URL(parsed.METABASE_BASE_URL);
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('METABASE_BASE_URL must use http/https');
  return {...parsed, METABASE_BASE_URL: u.toString().replace(/\/$/, '')};
}
