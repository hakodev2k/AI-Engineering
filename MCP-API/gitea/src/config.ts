import crypto from 'node:crypto';

export type Config = {
  baseUrl: string;
  token: string;
  timeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
  allowWrites: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const baseUrl = (env.GITEA_BASE_URL ?? '').trim().replace(/\/$/, '');
  const token = (env.GITEA_TOKEN ?? '').trim();
  if (!baseUrl) throw new Error('GITEA_BASE_URL is required');
  const u = new URL(baseUrl);
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('GITEA_BASE_URL must use http or https');
  if (!token) throw new Error('GITEA_TOKEN is required');
  const timeoutMs = Number(env.GITEA_TIMEOUT_MS ?? '15000');
  const maxRetries = Number(env.GITEA_MAX_RETRIES ?? '3');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid GITEA_TIMEOUT_MS');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('Invalid GITEA_MAX_RETRIES');
  return {
    baseUrl,
    token,
    timeoutMs,
    maxRetries,
    approvalSecret: env.GITEA_APPROVAL_SECRET?.trim() || undefined,
    allowWrites: String(env.GITEA_ALLOW_WRITES ?? 'false').toLowerCase() === 'true'
  };
}

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
