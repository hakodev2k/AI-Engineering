import { createHmac, timingSafeEqual } from 'node:crypto';

export type Config = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrite: boolean;
  allowDestructive: boolean;
  approvalSecret?: string;
  mcpAccessToken?: string;
  mcpS3Url: string;
};

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  const value = raw ? Number(raw) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

function boolEnv(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(env = process.env): Config {
  const old = process.env;
  process.env = env;
  try {
    const accessKeyId = env.WASABI_ACCESS_KEY_ID?.trim();
    const secretAccessKey = env.WASABI_SECRET_ACCESS_KEY?.trim();
    if (!accessKeyId || !secretAccessKey) throw new Error('WASABI_ACCESS_KEY_ID and WASABI_SECRET_ACCESS_KEY are required');
    const endpoint = env.WASABI_ENDPOINT?.trim() || 'https://s3.us-east-1.wasabisys.com';
    const url = new URL(endpoint);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.wasabisys.com')) throw new Error('WASABI_ENDPOINT must be an official HTTPS wasabisys.com endpoint');
    const mcpS3Url = env.WASABI_MCP_S3_URL?.trim() || 'https://mcp.wasabisys.dev/s3';
    const mcpUrl = new URL(mcpS3Url);
    if (mcpUrl.protocol !== 'https:' || mcpUrl.hostname !== 'mcp.wasabisys.dev' || mcpUrl.pathname !== '/s3') throw new Error('WASABI_MCP_S3_URL must be the official Wasabi S3 MCP endpoint');
    return {
      accessKeyId,
      secretAccessKey,
      region: env.WASABI_REGION?.trim() || 'us-east-1',
      endpoint: url.toString().replace(/\/$/, ''),
      timeoutMs: intEnv('WASABI_TIMEOUT_MS', 15000, 1000, 120000),
      maxRetries: intEnv('WASABI_MAX_RETRIES', 2, 0, 5),
      allowWrite: boolEnv('WASABI_ALLOW_WRITE'),
      allowDestructive: boolEnv('WASABI_ALLOW_DESTRUCTIVE'),
      approvalSecret: env.WASABI_APPROVAL_SECRET?.trim() || undefined,
      mcpAccessToken: env.WASABI_MCP_ACCESS_TOKEN?.trim() || undefined,
      mcpS3Url
    };
  } finally {
    process.env = old;
  }
}

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).filter(([k]) => k !== 'approvalToken').sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, args: unknown): string {
  return createHmac('sha256', secret).update(`${tool}\n${canonical(args)}`).digest('hex');
}

export function verifyApproval(secret: string | undefined, tool: string, args: Record<string, unknown>, token?: string): boolean {
  if (!secret || !token) return false;
  const expected = approvalDigest(secret, tool, args);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(token, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}
