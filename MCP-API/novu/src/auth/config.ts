export type NovuRegion = 'us' | 'eu';
export type Config = {
  secretKey: string;
  region: NovuRegion;
  apiBase: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

function httpsUrl(value: string, name: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`${name} must be a valid URL`); }
  if (url.protocol !== 'https:') throw new Error(`${name} must use HTTPS`);
  return url.toString().replace(/\/$/, '');
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const secretKey = env.NOVU_SECRET_KEY?.trim();
  if (!secretKey) throw new Error('NOVU_SECRET_KEY is required');
  const region = (env.NOVU_REGION || 'us').toLowerCase();
  if (region !== 'us' && region !== 'eu') throw new Error('NOVU_REGION must be us or eu');
  const defaultApi = region === 'eu' ? 'https://eu.api.novu.co' : 'https://api.novu.co';
  const defaultMcp = region === 'eu' ? 'https://eu.mcp.novu.co/' : 'https://mcp.novu.co/';
  const timeoutMs = Number(env.NOVU_TIMEOUT_MS || 20000);
  const maxRetries = Number(env.NOVU_MAX_RETRIES || 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('NOVU_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('NOVU_MAX_RETRIES must be 0..5');
  return {
    secretKey,
    region,
    apiBase: httpsUrl(env.NOVU_API_BASE || defaultApi, 'NOVU_API_BASE'),
    mcpUrl: httpsUrl(env.NOVU_MCP_URL || defaultMcp, 'NOVU_MCP_URL') + '/',
    timeoutMs,
    maxRetries,
    requireWriteApproval: (env.NOVU_REQUIRE_WRITE_APPROVAL || 'true') !== 'false',
    destructiveEnabled: env.NOVU_ENABLE_DESTRUCTIVE === 'true'
  };
}
