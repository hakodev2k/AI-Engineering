import crypto from 'node:crypto';

export type Config = {
  appId: string;
  searchKey?: string;
  adminKey?: string;
  mcpUrl?: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const appId = env.ALGOLIA_APPLICATION_ID?.trim();
  if (!appId) throw new Error('ALGOLIA_APPLICATION_ID is required');
  return {
    appId,
    searchKey: env.ALGOLIA_SEARCH_API_KEY?.trim() || undefined,
    adminKey: env.ALGOLIA_ADMIN_API_KEY?.trim() || undefined,
    mcpUrl: env.ALGOLIA_MCP_URL?.trim() || undefined,
    approvalSecret: env.ALGOLIA_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs: boundedInt(env.ALGOLIA_TIMEOUT_MS, 10_000, 1000, 60_000),
    maxRetries: boundedInt(env.ALGOLIA_MAX_RETRIES, 2, 0, 4)
  };
}

function boundedInt(raw: string | undefined, fallback: number, min: number, max: number) {
  const n = Number(raw ?? fallback);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid numeric configuration: ${raw}`);
  return n;
}

export function approvalToken(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
