import { z } from 'zod';

const parseBool = (value: string | undefined) => value === 'true';
const parseIntBounded = (value: string | undefined, fallback: number, max: number) => {
  const n = Number(value ?? fallback);
  if (!Number.isInteger(n) || n < 0) return fallback;
  return Math.min(n, max);
};

const baseUrl = process.env.APIFY_API_BASE_URL ?? 'https://api.apify.com/v2';
const parsed = new URL(baseUrl);
if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
  throw new Error('APIFY_API_BASE_URL must be an HTTPS URL without embedded credentials');
}

export const config = Object.freeze({
  token: process.env.APIFY_TOKEN ?? '',
  baseUrl: parsed.toString().replace(/\/$/, ''),
  timeoutMs: parseIntBounded(process.env.APIFY_TIMEOUT_MS, 15000, 120000),
  maxRetries: parseIntBounded(process.env.APIFY_MAX_RETRIES, 2, 5),
  allowWrite: parseBool(process.env.APIFY_ALLOW_WRITE),
  allowHighRisk: parseBool(process.env.APIFY_ALLOW_HIGH_RISK),
  allowDestructive: parseBool(process.env.APIFY_ALLOW_DESTRUCTIVE),
});

export const resourceId = z.string().min(1).max(256).regex(/^[A-Za-z0-9._~-]+$/, 'invalid Apify resource identifier');
export const actorId = z.string().min(1).max(256).regex(/^[A-Za-z0-9._~-]+$/, 'invalid Actor ID/name');
export const recordKey = z.string().min(1).max(512).refine(v => !v.includes('/') && !v.includes('..'), 'record key must not contain path separators or traversal');
export const pageLimit = z.number().int().min(1).max(1000).default(100);
export const offset = z.number().int().min(0).max(10_000_000).default(0);
export const jsonObject = z.record(z.string(), z.unknown()).default({});
