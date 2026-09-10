const bool = (v, d = false) => v == null ? d : String(v).toLowerCase() === 'true';
const int = (v, d, min, max) => {
  const n = v == null ? d : Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid numeric configuration: ${v}`);
  return n;
};

export function loadConfig(env = process.env) {
  const apiKey = env.TEMPORAL_CLOUD_API_KEY?.trim();
  if (!apiKey) throw new Error('TEMPORAL_CLOUD_API_KEY is required');
  const baseUrl = new URL(env.TEMPORAL_CLOUD_API_BASE_URL || 'https://saas-api.tmprl.cloud');
  if (baseUrl.protocol !== 'https:' || baseUrl.hostname !== 'saas-api.tmprl.cloud') {
    throw new Error('TEMPORAL_CLOUD_API_BASE_URL must be https://saas-api.tmprl.cloud');
  }
  const approvalSecret = env.TEMPORAL_CLOUD_APPROVAL_SECRET?.trim() || '';
  return Object.freeze({
    apiKey,
    baseUrl: baseUrl.origin,
    timeoutMs: int(env.TEMPORAL_CLOUD_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: int(env.TEMPORAL_CLOUD_MAX_RETRIES, 2, 0, 5),
    allowWrite: bool(env.TEMPORAL_CLOUD_ALLOW_WRITE, false),
    allowHighRisk: bool(env.TEMPORAL_CLOUD_ALLOW_HIGH_RISK, false),
    allowDestructive: bool(env.TEMPORAL_CLOUD_ALLOW_DESTRUCTIVE, false),
    approvalSecret,
    allowedAccountId: env.TEMPORAL_CLOUD_ALLOWED_ACCOUNT_ID?.trim() || ''
  });
}
