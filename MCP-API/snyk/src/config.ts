import crypto from 'node:crypto';
import { z } from 'zod';

const Env = z.object({
  SNYK_TOKEN: z.string().min(1),
  SNYK_ORG_ID: z.string().uuid().optional(),
  SNYK_REST_BASE_URL: z.string().url().default('https://api.snyk.io/rest'),
  SNYK_API_VERSION: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default('2024-10-15'),
  SNYK_CLI_PATH: z.string().min(1).default('snyk'),
  SNYK_APPROVAL_SECRET: z.string().min(16).optional(),
  SNYK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  SNYK_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2)
});

export type Config = z.infer<typeof Env>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return Env.parse(env);
}

export function resolveOrgId(input: string | undefined, config: Config): string {
  const orgId = input ?? config.SNYK_ORG_ID;
  if (!orgId) throw new Error('orgId is required when SNYK_ORG_ID is not configured');
  return z.string().uuid().parse(orgId);
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  const body = JSON.stringify(payload ?? {});
  return crypto.createHmac('sha256', secret).update(`${tool}\n${body}`).digest('hex');
}
