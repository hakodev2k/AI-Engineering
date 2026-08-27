import crypto from 'node:crypto';

export type Region = 'us' | 'eu';
export interface Config {
  apiKey: string;
  secretKey: string;
  region: Region;
  timeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
}

const positiveInt = (name: string, raw: string | undefined, fallback: number, max: number) => {
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > max) throw new Error(`${name} must be an integer between 1 and ${max}`);
  return value;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.AMPLITUDE_API_KEY?.trim();
  const secretKey = env.AMPLITUDE_SECRET_KEY?.trim();
  if (!apiKey) throw new Error('AMPLITUDE_API_KEY is required');
  if (!secretKey) throw new Error('AMPLITUDE_SECRET_KEY is required');
  const region = (env.AMPLITUDE_REGION ?? 'us').toLowerCase();
  if (region !== 'us' && region !== 'eu') throw new Error('AMPLITUDE_REGION must be us or eu');
  return {
    apiKey,
    secretKey,
    region,
    timeoutMs: positiveInt('AMPLITUDE_TIMEOUT_MS', env.AMPLITUDE_TIMEOUT_MS, 15000, 120000),
    maxRetries: positiveInt('AMPLITUDE_MAX_RETRIES', env.AMPLITUDE_MAX_RETRIES, 2, 5),
    approvalSecret: env.AMPLITUDE_APPROVAL_SECRET?.trim() || undefined
  };
}

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(`approve:${tool}`).digest('hex');
}
