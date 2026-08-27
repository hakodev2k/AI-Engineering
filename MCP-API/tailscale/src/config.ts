import crypto from 'node:crypto';

export type Config = {
  tailnet: string;
  apiBaseUrl: string;
  timeoutMs: number;
  apiKey?: string;
  oauthClientId?: string;
  oauthClientSecret?: string;
  approvalSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const tailnet = env.TAILSCALE_TAILNET?.trim();
  if (!tailnet) throw new Error('TAILSCALE_TAILNET is required');
  const apiKey = env.TAILSCALE_API_KEY?.trim();
  const oauthClientId = env.TAILSCALE_OAUTH_CLIENT_ID?.trim();
  const oauthClientSecret = env.TAILSCALE_OAUTH_CLIENT_SECRET?.trim();
  if (!apiKey && !(oauthClientId && oauthClientSecret)) {
    throw new Error('Configure either TAILSCALE_API_KEY or both TAILSCALE_OAUTH_CLIENT_ID and TAILSCALE_OAUTH_CLIENT_SECRET');
  }
  const timeoutMs = Number(env.TAILSCALE_TIMEOUT_MS ?? '15000');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('TAILSCALE_TIMEOUT_MS must be 1000..120000');
  const apiBaseUrl = (env.TAILSCALE_API_BASE_URL ?? 'https://api.tailscale.com/api/v2').replace(/\/$/, '');
  if (!apiBaseUrl.startsWith('https://')) throw new Error('TAILSCALE_API_BASE_URL must use HTTPS');
  return { tailnet, apiBaseUrl, timeoutMs, apiKey, oauthClientId, oauthClientSecret, approvalSecret: env.TAILSCALE_APPROVAL_SECRET };
}

export function approvalDigest(secret: string, tool: string, canonicalInput: string): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonicalInput}`).digest('hex');
}
