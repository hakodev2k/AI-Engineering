export function loadConfig(env = process.env) {
  if (!env.LOGZ_IO_API_TOKEN) throw new Error('LOGZ_IO_API_TOKEN is required');
  const baseUrl = new URL(env.LOGZ_IO_API_BASE_URL || 'https://api.logz.io');
  if (baseUrl.protocol !== 'https:') throw new Error('LOGZ_IO_API_BASE_URL must use HTTPS');
  if (!/^api(?:-[a-z]{2})?\.logz\.io$/.test(baseUrl.hostname)) throw new Error('LOGZ_IO_API_BASE_URL must be an official Logz.io API host');
  return {
    token: env.LOGZ_IO_API_TOKEN,
    baseUrl: baseUrl.origin,
    timeoutMs: boundedInt(env.LOGZ_IO_TIMEOUT_MS, 15000, 1000, 120000),
    maxReadRetries: boundedInt(env.LOGZ_IO_MAX_READ_RETRIES, 2, 0, 5),
    requireWriteApproval: env.LOGZ_IO_REQUIRE_WRITE_APPROVAL !== 'false',
    destructiveEnabled: env.LOGZ_IO_ENABLE_DESTRUCTIVE === 'true',
    approvalSecret: env.LOGZ_IO_APPROVAL_SECRET || ''
  };
}
function boundedInt(v, fallback, min, max) { const n = v === undefined ? fallback : Number(v); if (!Number.isInteger(n) || n < min || n > max) throw new Error('Invalid numeric configuration'); return n; }
