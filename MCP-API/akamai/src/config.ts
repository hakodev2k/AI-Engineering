import { z } from 'zod';

const bool = (v: string | undefined) => v === 'true';
const positiveInt = (v: string | undefined, fallback: number, max: number) => {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.floor(n), max) : fallback;
};

export const config = {
  clientToken: process.env.AKAMAI_CLIENT_TOKEN ?? '',
  clientSecret: process.env.AKAMAI_CLIENT_SECRET ?? '',
  accessToken: process.env.AKAMAI_ACCESS_TOKEN ?? '',
  host: process.env.AKAMAI_HOST ?? '',
  accountSwitchKey: process.env.AKAMAI_ACCOUNT_SWITCH_KEY,
  timeoutMs: positiveInt(process.env.AKAMAI_TIMEOUT_MS, 15000, 120000),
  maxRetries: positiveInt(process.env.AKAMAI_MAX_RETRIES, 2, 5),
  allowWrite: bool(process.env.AKAMAI_ALLOW_WRITE),
  allowHighRisk: bool(process.env.AKAMAI_ALLOW_HIGH_RISK),
  allowDestructive: bool(process.env.AKAMAI_ALLOW_DESTRUCTIVE),
};

export const idSchema = z.string().min(1).max(128).regex(/^[A-Za-z0-9_:\-.]+$/);
export const networkSchema = z.enum(['staging', 'production']).default('production');
export const papiNetworkSchema = z.enum(['STAGING', 'PRODUCTION', 'BOTH']).optional();
export const objectsStringSchema = z.array(z.string().min(1).max(2048)).min(1).max(10000);
export const cpCodesSchema = z.array(z.number().int().positive()).min(1).max(300);
