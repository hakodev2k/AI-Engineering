import crypto from 'node:crypto';

const intEnv = (name, fallback, min, max) => {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be ${min}..${max}`);
  return n;
};
const boolEnv = (name, fallback=false) => {
  const raw = process.env[name];
  if (!raw) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
};
export function loadConfig() {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  if (!key) throw new Error('POSTHOG_PERSONAL_API_KEY is required');
  if (!projectId || !/^\d+$/.test(projectId)) throw new Error('POSTHOG_PROJECT_ID must be numeric');
  const url = new URL(process.env.POSTHOG_BASE_URL || 'https://us.posthog.com');
  if (url.protocol !== 'https:' || url.username || url.password || (url.pathname && url.pathname !== '/') || url.search || url.hash) {
    throw new Error('POSTHOG_BASE_URL must be a credential-free HTTPS origin');
  }
  return Object.freeze({
    baseUrl: url.origin,
    apiKey: key,
    projectId,
    timeoutMs: intEnv('POSTHOG_TIMEOUT_MS', 10000, 1000, 120000),
    maxRetries: intEnv('POSTHOG_MAX_RETRIES', 3, 0, 5),
    approvalSecret: process.env.POSTHOG_APPROVAL_SECRET || '',
    destructiveEnabled: boolEnv('POSTHOG_ENABLE_DESTRUCTIVE', false)
  });
}
export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}
function stable(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
}
