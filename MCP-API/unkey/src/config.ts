export type Config = {
  rootKey: string;
  apiBase: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
  allowedHosts: Set<string>;
};

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === '') return fallback;
  return value.toLowerCase() === 'true';
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const rootKey = env.UNKEY_ROOT_KEY?.trim();
  if (!rootKey) throw new Error('UNKEY_ROOT_KEY is required');

  const apiBase = (env.UNKEY_API_BASE ?? 'https://api.unkey.com').replace(/\/$/, '');
  const url = new URL(apiBase);
  if (url.protocol !== 'https:') throw new Error('UNKEY_API_BASE must use HTTPS');

  const allowedHosts = new Set((env.UNKEY_ALLOWED_API_HOSTS ?? 'api.unkey.com').split(',').map(x => x.trim()).filter(Boolean));
  if (!allowedHosts.has(url.hostname)) throw new Error(`UNKEY_API_BASE host is not allowed: ${url.hostname}`);

  const timeoutMs = Number(env.UNKEY_REQUEST_TIMEOUT_MS ?? 15000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60000) throw new Error('UNKEY_REQUEST_TIMEOUT_MS must be an integer between 1000 and 60000');

  return {
    rootKey,
    apiBase,
    timeoutMs,
    requireWriteApproval: bool(env.UNKEY_REQUIRE_WRITE_APPROVAL, true),
    destructiveEnabled: bool(env.UNKEY_DESTRUCTIVE_ENABLED, false),
    allowedHosts,
  };
}
