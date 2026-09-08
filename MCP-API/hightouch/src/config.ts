import { z } from 'zod';

const bool = (v: string | undefined) => v === 'true';
const int = (v: string | undefined, fallback: number) => {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
};

export const config = {
  apiBaseUrl: process.env.HIGHTOUCH_API_BASE_URL ?? 'https://api.hightouch.com/api/v1',
  timeoutMs: int(process.env.HIGHTOUCH_TIMEOUT_MS, 15000),
  maxRetries: Math.min(int(process.env.HIGHTOUCH_MAX_RETRIES, 2), 5),
  allowWrite: bool(process.env.HIGHTOUCH_ALLOW_WRITE),
  allowHighRisk: bool(process.env.HIGHTOUCH_ALLOW_HIGH_RISK),
};

export const idSchema = z.union([z.string().min(1).max(128), z.number().int().positive()]).transform(String);
export const runLimitSchema = z.number().int().min(1).max(100).default(20);
