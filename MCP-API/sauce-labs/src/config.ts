export type SauceRegion = 'US_WEST' | 'US_EAST' | 'EU_CENTRAL';

export interface SauceConfig {
  username: string;
  accessKey: string;
  region: SauceRegion;
  mcpUrl: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
}

const REGIONS = new Set<SauceRegion>(['US_WEST', 'US_EAST', 'EU_CENTRAL']);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SauceConfig {
  const username = env.SAUCE_USERNAME?.trim();
  const accessKey = env.SAUCE_ACCESS_KEY?.trim();
  if (!username) throw new Error('SAUCE_USERNAME is required');
  if (!accessKey) throw new Error('SAUCE_ACCESS_KEY is required');

  const region = (env.SAUCE_REGION?.trim().toUpperCase() || 'US_WEST') as SauceRegion;
  if (!REGIONS.has(region)) throw new Error('SAUCE_REGION must be US_WEST, US_EAST, or EU_CENTRAL');

  const mcpUrl = env.SAUCE_MCP_URL?.trim() || 'https://mcp.saucelabs.com';
  const parsedUrl = new URL(mcpUrl);
  if (parsedUrl.protocol !== 'https:') throw new Error('SAUCE_MCP_URL must use HTTPS');
  if (parsedUrl.username || parsedUrl.password) throw new Error('SAUCE_MCP_URL must not embed credentials');

  const timeoutMs = Number(env.SAUCE_TIMEOUT_MS || 20000);
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('SAUCE_TIMEOUT_MS must be between 1000 and 120000');
  }

  return {
    username,
    accessKey,
    region,
    mcpUrl,
    timeoutMs,
    requireWriteApproval: (env.SAUCE_REQUIRE_WRITE_APPROVAL || 'true').toLowerCase() !== 'false',
    destructiveEnabled: (env.SAUCE_ENABLE_DESTRUCTIVE || 'false').toLowerCase() === 'true'
  };
}

export function basicAuthorization(config: Pick<SauceConfig, 'username' | 'accessKey'>): string {
  return `Basic ${Buffer.from(`${config.username}:${config.accessKey}`, 'utf8').toString('base64')}`;
}
