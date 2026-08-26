import crypto from 'node:crypto';

export type Config = {
  domain: string;
  clientId?: string;
  clientSecret?: string;
  managementToken?: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const domain = (env.AUTH0_DOMAIN ?? '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!domain || !/^[a-z0-9.-]+$/i.test(domain)) throw new Error('AUTH0_DOMAIN is required and must be a hostname');
  const managementToken = env.AUTH0_MANAGEMENT_TOKEN?.trim();
  const clientId = env.AUTH0_CLIENT_ID?.trim();
  const clientSecret = env.AUTH0_CLIENT_SECRET?.trim();
  if (!managementToken && !(clientId && clientSecret)) {
    throw new Error('Set AUTH0_MANAGEMENT_TOKEN or both AUTH0_CLIENT_ID and AUTH0_CLIENT_SECRET');
  }
  const timeoutMs = Number(env.AUTH0_TIMEOUT_MS ?? 10000);
  const maxRetries = Number(env.AUTH0_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('AUTH0_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('AUTH0_MAX_RETRIES must be 0..5');
  return { domain, clientId, clientSecret, managementToken, approvalSecret: env.AUTH0_APPROVAL_SECRET?.trim(), timeoutMs, maxRetries };
}

export function approvalDigest(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${JSON.stringify(payload)}`).digest('hex');
}
