import { z } from 'zod';

const bool = (v: string | undefined) => v === 'true';
const boundedInt = (v: string | undefined, fallback: number, max: number) => {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.floor(n), max) : fallback;
};

export const config = {
  apiKey: process.env.BUNNY_API_KEY ?? '',
  baseUrl: process.env.BUNNY_API_BASE_URL ?? 'https://api.bunny.net',
  timeoutMs: boundedInt(process.env.BUNNY_TIMEOUT_MS, 15000, 120000),
  maxRetries: boundedInt(process.env.BUNNY_MAX_RETRIES, 2, 5),
  allowWrite: bool(process.env.BUNNY_ALLOW_WRITE),
  allowHighRisk: bool(process.env.BUNNY_ALLOW_HIGH_RISK),
  allowDestructive: bool(process.env.BUNNY_ALLOW_DESTRUCTIVE),
};

export const idSchema = z.number().int().positive();
export const hostnameSchema = z.string().min(1).max(253);
export const ipSchema = z.string().min(3).max(64);
export const dnsRecordSchema = z.object({
  Type: z.number().int().min(0).max(15),
  Ttl: z.number().int().positive().optional(),
  Value: z.string().max(4096).optional(),
  Name: z.string().max(253).optional(),
  Weight: z.number().int().min(0).optional(),
  Priority: z.number().int().min(0).optional(),
  Port: z.number().int().min(0).max(65535).optional(),
  Flags: z.number().int().min(0).max(255).optional(),
  Tag: z.string().max(255).optional(),
  Disabled: z.boolean().optional(),
  Comment: z.string().max(1024).optional(),
});
