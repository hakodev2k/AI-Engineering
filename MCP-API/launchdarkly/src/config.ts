import crypto from 'node:crypto';

export type McpMode = 'hosted' | 'local' | 'rest';

export interface Config {
  accessToken?: string;
  apiBaseUrl: string;
  apiVersion: string;
  timeoutMs: number;
  maxRetries: number;
  mcpMode: McpMode;
  mcpServerUrl: string;
  mcpAccessToken?: string;
  approvalSecret?: string;
  allowDestructive: boolean;
}

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const mode = (env.LAUNCHDARKLY_MCP_MODE ?? 'local') as McpMode;
  if (!['hosted', 'local', 'rest'].includes(mode)) throw new Error('LAUNCHDARKLY_MCP_MODE must be hosted, local, or rest');
  const apiBaseUrl = env.LAUNCHDARKLY_API_BASE_URL ?? 'https://app.launchdarkly.com';
  const parsed = new URL(apiBaseUrl);
  if (parsed.protocol !== 'https:') throw new Error('LAUNCHDARKLY_API_BASE_URL must use https');
  return {
    accessToken: env.LAUNCHDARKLY_ACCESS_TOKEN,
    apiBaseUrl: parsed.origin,
    apiVersion: env.LAUNCHDARKLY_API_VERSION ?? '20240415',
    timeoutMs: Number(env.LAUNCHDARKLY_TIMEOUT_MS ?? 15000),
    maxRetries: Number(env.LAUNCHDARKLY_MAX_RETRIES ?? 3),
    mcpMode: mode,
    mcpServerUrl: env.LAUNCHDARKLY_MCP_SERVER_URL ?? 'https://mcp.launchdarkly.com/mcp/launchdarkly',
    mcpAccessToken: env.LAUNCHDARKLY_MCP_ACCESS_TOKEN,
    approvalSecret: env.LAUNCHDARKLY_APPROVAL_SECRET,
    allowDestructive: env.LAUNCHDARKLY_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
