import crypto from 'node:crypto';
import { z } from 'zod';

const Env = z.object({
  MAKE_API_TOKEN: z.string().min(1),
  MAKE_ZONE: z.string().regex(/^[a-z0-9-]+\.make\.com$/).default('eu1.make.com'),
  MAKE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  MAKE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  MAKE_APPROVAL_MODE: z.enum(['required','disabled']).default('required'),
  MAKE_APPROVED_ACTIONS: z.string().default(''),
  MAKE_ALLOW_DESTRUCTIVE: z.enum(['true','false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = Env.parse(env);
  return { ...v, baseUrl: `https://${v.MAKE_ZONE}/api/v2`, approved: new Set(v.MAKE_APPROVED_ACTIONS.split(',').map(x=>x.trim()).filter(Boolean)), destructive: v.MAKE_ALLOW_DESTRUCTIVE === 'true' };
}

export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function requireApproval(config: Config, action: string, risk: Risk) {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !config.destructive) throw new Error('DESTRUCTIVE_DISABLED');
  if (config.MAKE_APPROVAL_MODE === 'required' && !config.approved.has(action)) throw new Error('APPROVAL_REQUIRED');
}
export function redact(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return text.replace(/Token\s+[A-Za-z0-9._~-]+/gi, 'Token [REDACTED]').slice(0, 4000);
}
export function safeEqual(a:string,b:string){ const x=Buffer.from(a); const y=Buffer.from(b); return x.length===y.length && crypto.timingSafeEqual(x,y); }
