export interface MatomoConfig {
  baseUrl: URL;
  tokenAuth: string;
  mcpUrl?: URL;
  timeoutMs: number;
  maxRetries: number;
}

function bool(name: string): boolean {
  return (process.env[name] ?? '').toLowerCase() === 'true';
}

function parseEndpoint(raw: string, allowInsecure: boolean, label: string): URL {
  const url = new URL(raw);
  if (url.username || url.password || url.search || url.hash) throw new Error(`${label} must not contain credentials, query, or fragment`);
  if (url.protocol !== 'https:' && !(allowInsecure && url.protocol === 'http:')) {
    throw new Error(`${label} must use HTTPS`);
  }
  url.pathname = url.pathname.replace(/\/+$/, '');
  return url;
}

export function loadConfig(): MatomoConfig {
  const rawBase = process.env.MATOMO_BASE_URL?.trim();
  const tokenAuth = process.env.MATOMO_TOKEN_AUTH?.trim();
  if (!rawBase) throw new Error('MATOMO_BASE_URL is required');
  if (!tokenAuth) throw new Error('MATOMO_TOKEN_AUTH is required');
  if (tokenAuth.length < 16 || tokenAuth.length > 256) throw new Error('MATOMO_TOKEN_AUTH has an invalid length');

  const allowInsecure = bool('MATOMO_ALLOW_INSECURE_HTTP');
  const baseUrl = parseEndpoint(rawBase, allowInsecure, 'MATOMO_BASE_URL');
  const rawMcp = process.env.MATOMO_MCP_URL?.trim();
  const mcpUrl = rawMcp ? parseEndpoint(rawMcp, allowInsecure, 'MATOMO_MCP_URL') : undefined;
  if (mcpUrl && mcpUrl.origin !== baseUrl.origin && !bool('MATOMO_ALLOW_CROSS_ORIGIN_MCP')) {
    throw new Error('MATOMO_MCP_URL must share the MATOMO_BASE_URL origin unless explicitly allowed');
  }

  const timeoutMs = Number(process.env.MATOMO_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(process.env.MATOMO_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('MATOMO_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('MATOMO_MAX_RETRIES must be 0..5');
  return { baseUrl, tokenAuth, mcpUrl, timeoutMs, maxRetries };
}
