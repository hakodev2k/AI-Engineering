import { createHmac, timingSafeEqual } from 'node:crypto';

export type PrefectConfig = {
  apiUrl: string;
  apiKey?: string;
  apiVersion: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvalSecret?: string;
  enableHighRisk: boolean;
};

function intEnv(env: NodeJS.ProcessEnv, name: string, fallback: number, min: number, max: number): number {
  const raw = env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer in ${min}..${max}`);
  return value;
}

function boolEnv(env: NodeJS.ProcessEnv, name: string, fallback: boolean): boolean {
  const raw = env[name];
  if (raw === undefined) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): PrefectConfig {
  const apiUrl = env.PREFECT_API_URL?.replace(/\/$/, '');
  if (!apiUrl) throw new Error('PREFECT_API_URL is required');
  const parsed = new URL(apiUrl);
  if (parsed.protocol !== 'https:' && !['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)) {
    throw new Error('PREFECT_API_URL must use HTTPS except for localhost');
  }
  return {
    apiUrl,
    apiKey: env.PREFECT_API_KEY,
    apiVersion: env.PREFECT_API_VERSION || '0.8.4',
    timeoutMs: intEnv(env, 'PREFECT_TIMEOUT_MS', 15000, 1000, 120000),
    maxRetries: intEnv(env, 'PREFECT_MAX_RETRIES', 2, 0, 5),
    requireWriteApproval: boolEnv(env, 'PREFECT_REQUIRE_WRITE_APPROVAL', true),
    approvalSecret: env.PREFECT_APPROVAL_SECRET,
    enableHighRisk: boolEnv(env, 'PREFECT_ENABLE_HIGH_RISK', false)
  };
}

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    return `{${Object.keys(o).sort().map(k => `${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return createHmac('sha256', secret).update(`${tool}\n${canonical(payload)}`).digest('hex');
}

export function verifyApproval(secret: string, tool: string, payload: unknown, token?: string): boolean {
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return false;
  const expected = Buffer.from(approvalDigest(secret, tool, payload), 'hex');
  const actual = Buffer.from(token, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
