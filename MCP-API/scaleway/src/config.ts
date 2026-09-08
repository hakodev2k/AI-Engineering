import { z } from 'zod';

const int = (value: string | undefined, fallback: number, max: number) => {
  const n = Number(value ?? fallback);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(Math.floor(n), max);
};

const bool = (value: string | undefined) => value?.toLowerCase() === 'true';

export const zoneSchema = z.enum([
  'fr-par-1','fr-par-2','fr-par-3',
  'nl-ams-1','nl-ams-2','nl-ams-3',
  'pl-waw-1','pl-waw-2','pl-waw-3',
  'it-mil-1'
]);
export const regionSchema = z.enum(['fr-par','nl-ams','pl-waw','it-mil']);
export const uuidSchema = z.string().uuid();
export const pageSizeSchema = z.number().int().min(1).max(100).default(50);
export const maxPagesSchema = z.number().int().min(1).max(20).optional();

export const config = {
  secretKey: process.env.SCW_SECRET_KEY ?? '',
  organizationId: process.env.SCW_ORGANIZATION_ID,
  projectId: process.env.SCW_PROJECT_ID,
  defaultZone: zoneSchema.parse(process.env.SCW_DEFAULT_ZONE ?? 'fr-par-1'),
  defaultRegion: regionSchema.parse(process.env.SCW_DEFAULT_REGION ?? 'fr-par'),
  timeoutMs: int(process.env.SCW_TIMEOUT_MS, 15000, 60000),
  maxRetries: int(process.env.SCW_MAX_RETRIES, 2, 5),
  maxPages: int(process.env.SCW_MAX_PAGES, 10, 20),
  allowWrite: bool(process.env.SCW_ALLOW_WRITE),
  allowHighRisk: bool(process.env.SCW_ALLOW_HIGH_RISK)
};

export function assertConfigured(): void {
  if (!config.secretKey) throw new Error('SCW_SECRET_KEY is required');
}
