import { z } from 'zod';

const envSchema = z.object({
  STYTCH_PROJECT_ID: z.string().min(1),
  STYTCH_SECRET: z.string().min(1),
  STYTCH_ENVIRONMENT: z.enum(['test', 'live']).default('test'),
  STYTCH_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  STYTCH_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  STYTCH_REQUIRE_WRITE_APPROVAL: z.enum(['true', 'false']).default('true'),
  STYTCH_ENABLE_HIGH_RISK: z.enum(['true', 'false']).default('false'),
  STYTCH_APPROVAL_SECRET: z.string().optional()
});

export type Config = {
  projectId: string;
  secret: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  enableHighRisk: boolean;
  approvalSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.parse(env);
  return {
    projectId: parsed.STYTCH_PROJECT_ID,
    secret: parsed.STYTCH_SECRET,
    baseUrl: parsed.STYTCH_ENVIRONMENT === 'live' ? 'https://api.stytch.com' : 'https://test.stytch.com',
    timeoutMs: parsed.STYTCH_TIMEOUT_MS,
    maxRetries: parsed.STYTCH_MAX_RETRIES,
    requireWriteApproval: parsed.STYTCH_REQUIRE_WRITE_APPROVAL === 'true',
    enableHighRisk: parsed.STYTCH_ENABLE_HIGH_RISK === 'true',
    approvalSecret: parsed.STYTCH_APPROVAL_SECRET
  };
}
