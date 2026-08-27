import crypto from 'node:crypto';

export type Config = {
  secretKey: string;
  baseUrl: string;
  timeoutMs: number;
  approvalSecret?: string;
  requireWriteApproval: boolean;
  allowDestructive: boolean;
};

const bool = (v: string | undefined, d: boolean) => v == null ? d : ['1','true','yes','on'].includes(v.toLowerCase());

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const secretKey = env.CLERK_SECRET_KEY?.trim();
  if (!secretKey) throw new Error('CLERK_SECRET_KEY is required');
  const baseUrl = (env.CLERK_API_BASE_URL || 'https://api.clerk.com/v1').replace(/\/$/, '');
  if (!/^https:\/\//i.test(baseUrl)) throw new Error('CLERK_API_BASE_URL must use HTTPS');
  const timeoutMs = Number(env.CLERK_TIMEOUT_MS || 15000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('CLERK_TIMEOUT_MS must be 1000..120000');
  return {
    secretKey,
    baseUrl,
    timeoutMs,
    approvalSecret: env.CLERK_APPROVAL_SECRET?.trim() || undefined,
    requireWriteApproval: bool(env.CLERK_REQUIRE_WRITE_APPROVAL, true),
    allowDestructive: bool(env.CLERK_ALLOW_DESTRUCTIVE, false),
  };
}

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(`clerk:${tool}`).digest('hex');
}
