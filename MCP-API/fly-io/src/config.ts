import crypto from 'node:crypto';

export type Config = {
  token: string;
  baseUrl: string;
  orgSlug?: string;
  requireWriteApproval: boolean;
  approvalSecret?: string;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.FLY_API_TOKEN?.trim();
  if (!token) throw new Error('FLY_API_TOKEN is required');
  const baseUrl = (env.FLY_API_BASE_URL || 'https://api.machines.dev/v1').replace(/\/$/, '');
  if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://_api.internal')) throw new Error('FLY_API_BASE_URL must be the official public HTTPS endpoint or Fly internal API endpoint');
  const timeoutMs = Number(env.FLY_TIMEOUT_MS || '15000');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('FLY_TIMEOUT_MS must be between 1000 and 120000');
  return {
    token,
    baseUrl,
    orgSlug: env.FLY_ORG_SLUG?.trim() || undefined,
    requireWriteApproval: (env.FLY_REQUIRE_WRITE_APPROVAL || 'true').toLowerCase() !== 'false',
    approvalSecret: env.FLY_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs
  };
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${JSON.stringify(payload)}`).digest('hex');
}
