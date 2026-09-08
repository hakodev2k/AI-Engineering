import { z } from 'zod';

const asBool = (v: string | undefined) => v === 'true';
const asInt = (v: string | undefined, d: number) => {
  const n = Number(v ?? d);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : d;
};

export const config = {
  apiKey: process.env.MAILGUN_API_KEY ?? '',
  region: (process.env.MAILGUN_REGION ?? 'us').toLowerCase() === 'eu' ? 'eu' : 'us',
  defaultDomain: process.env.MAILGUN_DEFAULT_DOMAIN,
  timeoutMs: asInt(process.env.MAILGUN_TIMEOUT_MS, 15000),
  maxRetries: Math.min(asInt(process.env.MAILGUN_MAX_RETRIES, 2), 5),
  allowWrite: asBool(process.env.MAILGUN_ALLOW_WRITE),
  allowHighRisk: asBool(process.env.MAILGUN_ALLOW_HIGH_RISK),
  allowDestructive: asBool(process.env.MAILGUN_ALLOW_DESTRUCTIVE),
};

export const domainSchema = z.string().min(1).max(253).regex(/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i);
export const emailSchema = z.string().email().max(320);
export const webhookTypeSchema = z.enum(['accepted','delivered','opened','clicked','unsubscribed','complained','temporary_fail','permanent_fail']);
