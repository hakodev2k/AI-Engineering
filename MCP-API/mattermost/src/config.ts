import crypto from 'node:crypto';

export interface Config {
  serverUrl: string;
  accessToken: string;
  upstreamMcpUrl?: string;
  upstreamMcpBearerToken?: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  enableDestructive: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const serverUrl = (env.MATTERMOST_SERVER_URL ?? '').replace(/\/$/, '');
  const accessToken = env.MATTERMOST_ACCESS_TOKEN ?? '';
  if (!serverUrl || !/^https?:\/\//.test(serverUrl)) throw new Error('MATTERMOST_SERVER_URL must be an absolute HTTP(S) URL');
  if (!accessToken) throw new Error('MATTERMOST_ACCESS_TOKEN is required');
  const timeoutMs = Number(env.MATTERMOST_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.MATTERMOST_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('MATTERMOST_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('MATTERMOST_MAX_RETRIES must be 0..5');
  return {
    serverUrl,
    accessToken,
    upstreamMcpUrl: env.MATTERMOST_UPSTREAM_MCP_URL,
    upstreamMcpBearerToken: env.MATTERMOST_UPSTREAM_MCP_BEARER_TOKEN,
    approvalSecret: env.MATTERMOST_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    enableDestructive: env.MATTERMOST_ENABLE_DESTRUCTIVE === 'true'
  };
}

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
