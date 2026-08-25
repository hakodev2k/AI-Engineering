import crypto from 'node:crypto';

export type Config = { accessToken: string; apiBaseUrl: string; approvalSecret?: string; timeoutMs: number; maxRetries: number };

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const accessToken = env.ZOOM_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error('ZOOM_ACCESS_TOKEN is required');
  const apiBaseUrl = (env.ZOOM_API_BASE_URL || 'https://api.zoom.us/v2').replace(/\/$/, '');
  if (apiBaseUrl !== 'https://api.zoom.us/v2') throw new Error('ZOOM_API_BASE_URL must be https://api.zoom.us/v2');
  const timeoutMs = Number(env.ZOOM_TIMEOUT_MS || 15000);
  const maxRetries = Number(env.ZOOM_MAX_RETRIES || 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid ZOOM_TIMEOUT_MS');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('Invalid ZOOM_MAX_RETRIES');
  return { accessToken, apiBaseUrl, approvalSecret: env.ZOOM_APPROVAL_SECRET, timeoutMs, maxRetries };
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${JSON.stringify(payload)}`).digest('hex');
}
