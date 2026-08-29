import crypto from 'node:crypto';

function intValue(raw, fallback, min, max) {
  if (raw == null || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Integer environment value must be between ${min} and ${max}`);
  return n;
}
function safeUrl(raw, name) {
  const u = new URL(raw);
  const local = ['localhost', '127.0.0.1', '::1'].includes(u.hostname);
  if (u.protocol !== 'https:' && !(u.protocol === 'http:' && local)) throw new Error(`${name} must use HTTPS except for localhost`);
  if (u.username || u.password || u.hash) throw new Error(`${name} must not contain credentials or fragment`);
  return u.toString().replace(/\/$/, '');
}
export function loadConfig(env = process.env) {
  const authMode = env.AIRBYTE_AUTH_MODE || 'client_credentials';
  if (!['client_credentials', 'none'].includes(authMode)) throw new Error('AIRBYTE_AUTH_MODE must be client_credentials or none');
  if (authMode === 'client_credentials' && (!env.AIRBYTE_CLIENT_ID || !env.AIRBYTE_CLIENT_SECRET)) throw new Error('AIRBYTE_CLIENT_ID and AIRBYTE_CLIENT_SECRET are required');
  return Object.freeze({
    apiUrl: safeUrl(env.AIRBYTE_API_URL || 'https://api.airbyte.com/v1', 'AIRBYTE_API_URL'),
    tokenUrl: safeUrl(env.AIRBYTE_TOKEN_URL || 'https://api.airbyte.com/v1/applications/token', 'AIRBYTE_TOKEN_URL'),
    clientId: env.AIRBYTE_CLIENT_ID || '', clientSecret: env.AIRBYTE_CLIENT_SECRET || '', authMode,
    timeoutMs: intValue(env.AIRBYTE_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: intValue(env.AIRBYTE_MAX_RETRIES, 3, 0, 5), approvalSecret: env.AIRBYTE_APPROVAL_SECRET || ''
  });
}
function stable(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
}
export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}
