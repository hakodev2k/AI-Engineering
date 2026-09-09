export type ConnectorConfig = {
  baseUrl: string;
  authToken?: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const raw = env.POCKETBASE_BASE_URL?.trim();
  if (!raw) throw new Error('POCKETBASE_BASE_URL is required');
  const url = new URL(raw);
  const local = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) {
    throw new Error('POCKETBASE_BASE_URL must use HTTPS (HTTP is allowed only for localhost)');
  }
  if (url.username || url.password) throw new Error('POCKETBASE_BASE_URL must not contain credentials');
  url.pathname = url.pathname.replace(/\/$/, '');
  url.search = '';
  url.hash = '';

  const timeoutMs = Number(env.POCKETBASE_TIMEOUT_MS || '20000');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('POCKETBASE_TIMEOUT_MS must be between 1000 and 120000');
  }

  return {
    baseUrl: url.toString().replace(/\/$/, ''),
    authToken: env.POCKETBASE_AUTH_TOKEN?.trim() || undefined,
    timeoutMs,
    requireWriteApproval: (env.POCKETBASE_REQUIRE_WRITE_APPROVAL || 'true') !== 'false',
    destructiveEnabled: env.POCKETBASE_ENABLE_DESTRUCTIVE === 'true'
  };
}
