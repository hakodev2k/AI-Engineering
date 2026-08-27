import crypto from 'node:crypto';

export interface Config {
  token: string;
  mcpUrl: string;
  apiBaseUrl: string;
  toolsets: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxReadRetries: number;
}

function positiveInt(name: string, raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.BUILDKITE_API_TOKEN?.trim();
  if (!token) throw new Error('BUILDKITE_API_TOKEN is required');
  const mcpUrl = env.BUILDKITE_MCP_URL?.trim() || 'https://mcp.buildkite.com/direct';
  const apiBaseUrl = env.BUILDKITE_API_BASE_URL?.trim() || 'https://api.buildkite.com/v2';
  for (const [name, value, allowedHost] of [
    ['BUILDKITE_MCP_URL', mcpUrl, 'mcp.buildkite.com'],
    ['BUILDKITE_API_BASE_URL', apiBaseUrl, 'api.buildkite.com']
  ] as const) {
    const url = new URL(value);
    if (url.protocol !== 'https:') throw new Error(`${name} must use HTTPS`);
    if (url.hostname !== allowedHost) throw new Error(`${name} host must be ${allowedHost}`);
  }
  return {
    token,
    mcpUrl,
    apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
    toolsets: env.BUILDKITE_TOOLSETS?.trim() || 'user,pipelines,builds,logs,artifacts,annotations',
    approvalSecret: env.BUILDKITE_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs: positiveInt('BUILDKITE_TIMEOUT_MS', env.BUILDKITE_TIMEOUT_MS, 20_000),
    maxReadRetries: positiveInt('BUILDKITE_MAX_READ_RETRIES', env.BUILDKITE_MAX_READ_RETRIES, 3)
  };
}

export function approvalDigest(secret: string, tool: string, intent: string): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${intent}`).digest('hex');
}
