import crypto from 'node:crypto';
import { z } from 'zod';

const Env = z.object({
  FASTLY_API_TOKEN: z.string().min(1),
  FASTLY_API_BASE_URL: z.string().url().default('https://api.fastly.com'),
  FASTLY_TIMEOUT_MS: z.coerce.number().int().positive().max(120000).default(15000),
  FASTLY_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  FASTLY_APPROVAL_SECRET: z.string().min(16).optional(),
  FASTLY_REQUIRE_WRITE_APPROVAL: z.enum(['true','false']).default('true')
});

export type Config = {
  token: string; apiBaseUrl: string; timeoutMs: number; maxRetries: number;
  approvalSecret?: string; requireWriteApproval: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const e = Env.parse(env);
  const u = new URL(e.FASTLY_API_BASE_URL);
  if (u.protocol !== 'https:' || u.hostname !== 'api.fastly.com') throw new Error('FASTLY_API_BASE_URL must be https://api.fastly.com');
  return { token: e.FASTLY_API_TOKEN, apiBaseUrl: u.origin, timeoutMs: e.FASTLY_TIMEOUT_MS,
    maxRetries: e.FASTLY_MAX_RETRIES, approvalSecret: e.FASTLY_APPROVAL_SECRET,
    requireWriteApproval: e.FASTLY_REQUIRE_WRITE_APPROVAL === 'true' };
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(tool).update('\n').update(JSON.stringify(payload)).digest('hex');
}
