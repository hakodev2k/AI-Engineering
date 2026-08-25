import crypto from 'node:crypto';

export type PlaidEnv = 'sandbox' | 'production';

export interface Config {
  clientId: string;
  secret: string;
  env: PlaidEnv;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvalSecret?: string;
}

function integer(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(): Config {
  const clientId = process.env.PLAID_CLIENT_ID?.trim();
  const secret = process.env.PLAID_SECRET?.trim();
  if (!clientId || !secret) throw new Error('PLAID_CLIENT_ID and PLAID_SECRET are required');
  const env = (process.env.PLAID_ENV || 'sandbox') as PlaidEnv;
  if (!['sandbox', 'production'].includes(env)) throw new Error('PLAID_ENV must be sandbox or production');
  return {
    clientId,
    secret,
    env,
    baseUrl: env === 'production' ? 'https://production.plaid.com' : 'https://sandbox.plaid.com',
    timeoutMs: integer('PLAID_TIMEOUT_MS', 15000, 1000, 120000),
    maxRetries: integer('PLAID_MAX_RETRIES', 2, 0, 5),
    requireWriteApproval: (process.env.PLAID_REQUIRE_WRITE_APPROVAL || 'true').toLowerCase() !== 'false',
    approvalSecret: process.env.PLAID_APPROVAL_SECRET?.trim() || undefined
  };
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}:${JSON.stringify(payload)}`).digest('hex');
}
