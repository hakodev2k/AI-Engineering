import { z } from 'zod';

const schema = z.object({
  HARNESS_ACCOUNT_ID: z.string().min(1),
  HARNESS_ORG_ID: z.string().min(1),
  HARNESS_PROJECT_ID: z.string().min(1),
  HARNESS_BASE_URL: z.string().url().default('https://app.harness.io'),
  HARNESS_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  HARNESS_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  HARNESS_WRITE_APPROVED: z.enum(['true','false']).default('false')
});

export type HarnessConfig = z.infer<typeof schema>;
export function loadConfig(env = process.env): HarnessConfig {
  const cfg = schema.parse(env);
  const u = new URL(cfg.HARNESS_BASE_URL);
  if (u.protocol !== 'https:' || !u.hostname.endsWith('harness.io')) throw new Error('HARNESS_BASE_URL must be an HTTPS harness.io host');
  return cfg;
}
