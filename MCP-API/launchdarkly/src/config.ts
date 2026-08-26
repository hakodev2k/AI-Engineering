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

function boundedInt(env: NodeJS.ProcessEnv, name: string, fallback: number, min: number, max: number): number {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const mode = (env.LAUNCHDARKLY_MCP_MODE ?? 'local') as McpMode;
  if (!['hosted', 'local', 'rest'].includes(mode)) throw new Error('LAUNCHDARKLY_MCP_MODE must be hosted, local, or rest');
  const apiBaseUrl = env.LAUNCHDARKLY_API_BASE_URL ?? 'https://app.launchdarkly.com';
  const parsed = new URL(apiBaseUrl);
  if (parsed.protocol !== 'https:') throw new Error('LAUNCHDARKLY_API_BASE_URL must use https');
  const mcpServerUrl = env.LAUNCHDARKLY_MCP_SERVER_URL ?? 'https://mcp.launchdarkly.com/mcp/launchdarkly';
  const mcpUrl = new URL(mcpServerUrl);
  if (mcpUrl.protocol !== 'https:') throw new Error('LAUNCHDARKLY_MCP_SERVER_URL must use https');
  return {
    accessToken: env.LAUNCHDARKLY_ACCESS_TOKEN,
    apiBaseUrl: parsed.origin,
    apiVersion: env.LAUNCHDARKLY_API_VERSION ?? '20240415',
    timeoutMs: boundedInt(env, 'LAUNCHDARKLY_TIMEOUT_MS', 15000, 100, 120000),
    maxRetries: boundedInt(env, 'LAUNCHDARKLY_MAX_RETRIES', 3, 0, 10),
    mcpMode: mode,
    mcpServerUrl: mcpUrl.toString(),
    mcpAccessToken: env.LAUNCHDARKLY_MCP_ACCESS_TOKEN,
    approvalSecret: env.LAUNCHDARKLY_APPROVAL_SECRET,
    allowDestructive: env.LAUNCHDARKLY_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
