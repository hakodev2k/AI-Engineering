export type ConnectorConfig = {
  token: string;
  org: string;
  baseUrl: string;
  allowedProjects: Set<string>;
  requireWriteApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
};

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const token = env.SENTRY_AUTH_TOKEN?.trim();
  const org = env.SENTRY_ORG?.trim();
  if (!token) throw new Error('SENTRY_AUTH_TOKEN is required.');
  if (!org || !/^[A-Za-z0-9._-]+$/.test(org)) throw new Error('SENTRY_ORG must be a valid organization slug or ID.');

  const base = new URL(env.SENTRY_BASE_URL?.trim() || 'https://sentry.io');
  if (base.protocol !== 'https:' && !['localhost', '127.0.0.1', '::1'].includes(base.hostname)) {
    throw new Error('SENTRY_BASE_URL must use HTTPS except for localhost self-hosted development.');
  }

  const timeoutMs = Number(env.SENTRY_TIMEOUT_MS || 15000);
  const maxRetries = Number(env.SENTRY_MAX_RETRIES || 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('SENTRY_TIMEOUT_MS must be 1000..120000.');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('SENTRY_MAX_RETRIES must be 0..5.');

  return {
    token,
    org,
    baseUrl: base.toString().replace(/\/$/, ''),
    allowedProjects: new Set((env.SENTRY_ALLOWED_PROJECTS || '').split(',').map(v => v.trim()).filter(Boolean)),
    requireWriteApproval: bool(env.SENTRY_REQUIRE_WRITE_APPROVAL, true),
    timeoutMs,
    maxRetries
  };
}
