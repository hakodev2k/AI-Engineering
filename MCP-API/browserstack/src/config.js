import crypto from 'node:crypto';

function intEnv(name, fallback, min, max) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

function boolEnv(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig() {
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
  if (!username) throw new Error('BROWSERSTACK_USERNAME is required');
  if (!accessKey) throw new Error('BROWSERSTACK_ACCESS_KEY is required');

  const base = new URL(process.env.BROWSERSTACK_API_BASE_URL || 'https://api.browserstack.com');
  if (base.protocol !== 'https:') throw new Error('BROWSERSTACK_API_BASE_URL must use HTTPS');
  if (base.username || base.password || base.search || base.hash || (base.pathname && base.pathname !== '/')) {
    throw new Error('BROWSERSTACK_API_BASE_URL must be a clean HTTPS origin');
  }

  return Object.freeze({
    username,
    accessKey,
    baseUrl: base.origin,
    timeoutMs: intEnv('BROWSERSTACK_TIMEOUT_MS', 10000, 1000, 120000),
    maxRetries: intEnv('BROWSERSTACK_MAX_RETRIES', 3, 0, 5),
    approvalSecret: process.env.BROWSERSTACK_APPROVAL_SECRET || '',
    destructiveEnabled: boolEnv('BROWSERSTACK_ENABLE_DESTRUCTIVE', false)
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
