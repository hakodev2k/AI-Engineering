import crypto from 'node:crypto';

export type Config = {
  token: string;
  apiBaseUrl: string;
  uploadBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
  destructiveEnabled: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.BOX_ACCESS_TOKEN?.trim();
  if (!token) throw new Error('BOX_ACCESS_TOKEN is required');
  const timeoutMs = Number(env.BOX_TIMEOUT_MS ?? '15000');
  const maxRetries = Number(env.BOX_MAX_RETRIES ?? '3');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid BOX_TIMEOUT_MS');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('Invalid BOX_MAX_RETRIES');
  return {
    token,
    apiBaseUrl: env.BOX_API_BASE_URL ?? 'https://api.box.com/2.0',
    uploadBaseUrl: env.BOX_UPLOAD_BASE_URL ?? 'https://upload.box.com/api/2.0',
    timeoutMs,
    maxRetries,
    approvalSecret: env.BOX_APPROVAL_SECRET,
    destructiveEnabled: env.BOX_ENABLE_DESTRUCTIVE === 'true'
  };
}

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
