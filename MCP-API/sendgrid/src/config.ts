import crypto from 'node:crypto';

export type SendGridConfig = {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
  allowWrites: boolean;
  allowHighRisk: boolean;
};

function parseBool(value: string | undefined, fallback = false) {
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SendGridConfig {
  const apiKey = env.SENDGRID_API_KEY?.trim();
  if (!apiKey) throw new Error('SENDGRID_API_KEY is required');
  const region = (env.SENDGRID_REGION ?? 'global').toLowerCase();
  if (!['global', 'eu'].includes(region)) throw new Error('SENDGRID_REGION must be global or eu');
  const timeoutMs = Number(env.SENDGRID_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.SENDGRID_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('SENDGRID_TIMEOUT_MS must be an integer from 1000 to 120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('SENDGRID_MAX_RETRIES must be an integer from 0 to 5');
  return {
    apiKey,
    baseUrl: region === 'eu' ? 'https://api.eu.sendgrid.com' : 'https://api.sendgrid.com',
    timeoutMs,
    maxRetries,
    approvalSecret: env.SENDGRID_APPROVAL_SECRET,
    allowWrites: parseBool(env.SENDGRID_ALLOW_WRITES),
    allowHighRisk: parseBool(env.SENDGRID_ALLOW_HIGH_RISK)
  };
}

export function approvalDigest(secret: string, tool: string, payload: unknown) {
  const body = JSON.stringify(payload ?? {});
  return crypto.createHmac('sha256', secret).update(`${tool}\n${body}`).digest('hex');
}
