import crypto from 'node:crypto';

function intEnv(env, name, fallback, min, max) {
  const raw = env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(env = process.env) {
  const apiKey = env.KLAVIYO_API_KEY;
  if (!apiKey) throw new Error('KLAVIYO_API_KEY is required');
  const revision = env.KLAVIYO_REVISION || '2026-07-15';
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(revision)) throw new Error('KLAVIYO_REVISION must use YYYY-MM-DD');
  return Object.freeze({
    baseUrl: 'https://a.klaviyo.com',
    apiKey,
    revision,
    timeoutMs: intEnv(env, 'KLAVIYO_TIMEOUT_MS', 10000, 1000, 120000),
    maxRetries: intEnv(env, 'KLAVIYO_MAX_RETRIES', 3, 0, 5),
    approvalSecret: env.KLAVIYO_APPROVAL_SECRET || ''
  });
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}
function stable(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
}
