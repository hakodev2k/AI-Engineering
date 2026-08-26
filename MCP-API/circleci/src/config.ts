import crypto from 'node:crypto';

export interface Config {
  apiToken: string;
  mcpBearerToken: string;
  apiBaseUrl: string;
  mcpUrl: string;
  requestTimeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
}

function positiveInt(value: string | undefined, fallback: number, name: string): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

function assertHttpsUrl(value: string, name: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error(`${name} must use HTTPS unless it targets localhost`);
  }
  return url.toString().replace(/\/$/, '');
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiToken = env.CIRCLECI_TOKEN?.trim();
  if (!apiToken) throw new Error('CIRCLECI_TOKEN is required');
  return {
    apiToken,
    mcpBearerToken: env.CIRCLECI_MCP_BEARER_TOKEN?.trim() || apiToken,
    apiBaseUrl: assertHttpsUrl(env.CIRCLECI_API_BASE_URL || 'https://circleci.com/api/v2', 'CIRCLECI_API_BASE_URL'),
    mcpUrl: assertHttpsUrl(env.CIRCLECI_MCP_URL || 'https://mcp.circleci.com/v1/mcp', 'CIRCLECI_MCP_URL'),
    requestTimeoutMs: positiveInt(env.CIRCLECI_REQUEST_TIMEOUT_MS, 15000, 'CIRCLECI_REQUEST_TIMEOUT_MS'),
    maxRetries: Math.min(5, positiveInt(env.CIRCLECI_MAX_RETRIES, 3, 'CIRCLECI_MAX_RETRIES')),
    approvalSecret: env.CIRCLECI_APPROVAL_SECRET?.trim() || undefined
  };
}

export function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, argsWithoutApproval: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonicalize(argsWithoutApproval)}`).digest('hex');
}
