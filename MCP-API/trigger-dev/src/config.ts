import { z } from 'zod';

const bool = (v: string | undefined) => v === 'true';
const int = (v: string | undefined, fallback: number) => {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
};

export const config = {
  secretKey: process.env.TRIGGER_SECRET_KEY ?? '',
  apiUrl: (process.env.TRIGGER_API_URL ?? 'https://api.trigger.dev').replace(/\/$/, ''),
  timeoutMs: int(process.env.TRIGGER_TIMEOUT_MS, 15000),
  maxRetries: Math.min(int(process.env.TRIGGER_MAX_RETRIES, 2), 5),
  allowWrite: bool(process.env.TRIGGER_ALLOW_WRITE),
  allowHighRisk: bool(process.env.TRIGGER_ALLOW_HIGH_RISK),
};

export const idSchema = z.string().min(3).max(200).regex(/^[A-Za-z0-9_.:-]+$/);
export const runIdSchema = z.string().regex(/^run_[A-Za-z0-9]+$/);
export const batchIdSchema = z.string().regex(/^batch_[A-Za-z0-9]+$/);
export const scheduleIdSchema = z.string().regex(/^sched_[A-Za-z0-9]+$/);
export const taskIdSchema = z.string().min(1).max(200).regex(/^[A-Za-z0-9_.:-]+$/);
