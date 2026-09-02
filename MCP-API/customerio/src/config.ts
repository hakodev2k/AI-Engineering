export type Region = 'us' | 'eu';
export type Config = {
  appApiKey: string;
  region: Region;
  apiBaseUrl: string;
  mcpUrl: string;
  mcpAccessToken?: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
};
const bool = (v: string | undefined, fallback: boolean) => v == null ? fallback : /^(1|true|yes)$/i.test(v);
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const appApiKey = env.CUSTOMERIO_APP_API_KEY?.trim();
  if (!appApiKey) throw new Error('CUSTOMERIO_APP_API_KEY is required');
  const region = (env.CUSTOMERIO_REGION ?? 'us').toLowerCase();
  if (region !== 'us' && region !== 'eu') throw new Error('CUSTOMERIO_REGION must be us or eu');
  const defaultApi = region === 'eu' ? 'https://api-eu.customer.io' : 'https://api.customer.io';
  const defaultMcp = region === 'eu' ? 'https://mcp-eu.customer.io/mcp' : 'https://mcp.customer.io/mcp';
  const apiBaseUrl = new URL(env.CUSTOMERIO_API_BASE_URL ?? defaultApi).toString().replace(/\/$/, '');
  const mcpUrl = new URL(env.CUSTOMERIO_MCP_URL ?? defaultMcp).toString();
  const timeoutMs = Number(env.CUSTOMERIO_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.CUSTOMERIO_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('CUSTOMERIO_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('CUSTOMERIO_MAX_RETRIES must be 0..5');
  return {
    appApiKey,
    region,
    apiBaseUrl,
    mcpUrl,
    mcpAccessToken: env.CUSTOMERIO_MCP_ACCESS_TOKEN?.trim() || undefined,
    timeoutMs,
    maxRetries,
    requireWriteApproval: bool(env.CUSTOMERIO_REQUIRE_WRITE_APPROVAL, true),
    approvedActions: new Set((env.CUSTOMERIO_APPROVED_ACTIONS ?? '').split(',').map(x => x.trim()).filter(Boolean))
  };
}
