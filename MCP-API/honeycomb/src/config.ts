import crypto from 'node:crypto';

export interface Config {
  mcpUrl: string;
  apiKey: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  maxPayloadBytes: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const mcpUrl = env.HONEYCOMB_MCP_URL || 'https://mcp.honeycomb.io/mcp';
  const parsed = new URL(mcpUrl);
  if (parsed.protocol !== 'https:') throw new Error('HONEYCOMB_MCP_URL must use https');
  if (!['mcp.honeycomb.io', 'mcp.eu1.honeycomb.io'].includes(parsed.hostname)) {
    throw new Error('HONEYCOMB_MCP_URL host is not an official Honeycomb MCP endpoint');
  }
  const apiKey = env.HONEYCOMB_MCP_API_KEY || '';
  if (!apiKey || !apiKey.includes(':')) throw new Error('HONEYCOMB_MCP_API_KEY must be <key-id>:<key-secret>');
  const timeoutMs = boundedInt(env.HONEYCOMB_TIMEOUT_MS, 15000, 1000, 60000);
  const maxRetries = boundedInt(env.HONEYCOMB_MAX_RETRIES, 2, 0, 5);
  const maxPayloadBytes = boundedInt(env.HONEYCOMB_MAX_PAYLOAD_BYTES, 32768, 1024, 131072);
  return { mcpUrl, apiKey, approvalSecret: env.HONEYCOMB_APPROVAL_SECRET, timeoutMs, maxRetries, maxPayloadBytes };
}

function boundedInt(value: string | undefined, fallback: number, min: number, max: number): number {
  const n = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`integer must be in range ${min}..${max}`);
  return n;
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
