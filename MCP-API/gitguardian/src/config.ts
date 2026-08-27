import crypto from 'node:crypto';

export type Config = {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.GITGUARDIAN_API_KEY?.trim();
  if (!apiKey) throw new Error('GITGUARDIAN_API_KEY is required');
  const baseUrl = (env.GITGUARDIAN_BASE_URL || 'https://api.gitguardian.com/v1').replace(/\/$/, '');
  if (!/^https:\/\/api(?:\.eu1)?\.gitguardian\.com\/v1$/.test(baseUrl)) {
    throw new Error('GITGUARDIAN_BASE_URL must be an official GitGuardian v1 API endpoint');
  }
  return {
    apiKey,
    baseUrl,
    timeoutMs: boundedInt(env.GITGUARDIAN_TIMEOUT_MS, 15000, 1000, 60000),
    maxRetries: boundedInt(env.GITGUARDIAN_MAX_RETRIES, 3, 0, 5),
    approvalSecret: env.GITGUARDIAN_APPROVAL_SECRET?.trim() || undefined
  };
}

function boundedInt(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = value ? Number(value) : fallback;
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new Error(`Invalid numeric configuration: ${value}`);
  return parsed;
}

export function approvalDigest(secret: string, tool: string, resource: string) {
  return crypto.createHmac('sha256', secret).update(`${tool}:${resource}`).digest('hex');
}
