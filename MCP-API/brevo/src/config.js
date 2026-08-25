import crypto from 'node:crypto';

export function loadConfig(env = process.env) {
  const timeoutMs = int(env.BREVO_REQUEST_TIMEOUT_MS, 15000, 1000, 120000);
  const maxRetries = int(env.BREVO_MAX_RETRIES, 3, 0, 5);
  return {
    apiKey: env.BREVO_API_KEY || '',
    baseUrl: normalizeBase(env.BREVO_API_BASE_URL || 'https://api.brevo.com/v3'),
    timeoutMs,
    maxRetries,
    allowWrite: env.BREVO_ALLOW_WRITE === 'true',
    allowDestructive: env.BREVO_ALLOW_DESTRUCTIVE === 'true',
    approvalSecret: env.BREVO_APPROVAL_SECRET || ''
  };
}

function int(value, fallback, min, max) {
  const n = value == null || value === '' ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid integer configuration: ${value}`);
  return n;
}

function normalizeBase(value) {
  const u = new URL(value);
  if (u.protocol !== 'https:') throw new Error('BREVO_API_BASE_URL must use https');
  if (u.username || u.password) throw new Error('BREVO_API_BASE_URL must not contain credentials');
  return u.toString().replace(/\/$/, '');
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret, tool, args) {
  const clean = { ...args };
  delete clean.approvalToken;
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonicalJson(clean)}`).digest('hex');
}
