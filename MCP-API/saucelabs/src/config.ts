export type SauceRegion = 'us-west-1' | 'us-east-4' | 'eu-central-1';

export interface SauceConfig {
  username: string;
  accessKey: string;
  region: SauceRegion;
  apiBaseUrl: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  enableWrites: boolean;
}

const regionalApi: Record<SauceRegion, string> = {
  'us-west-1': 'https://api.us-west-1.saucelabs.com',
  'us-east-4': 'https://api.us-east-4.saucelabs.com',
  'eu-central-1': 'https://api.eu-central-1.saucelabs.com'
};

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return n;
}

function httpsUrl(name: string, value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error(`${name} must use https`);
  return url.toString().replace(/\/$/, '');
}

export function loadConfig(): SauceConfig {
  const username = process.env.SAUCE_USERNAME?.trim();
  const accessKey = process.env.SAUCE_ACCESS_KEY?.trim();
  if (!username || !accessKey) throw new Error('SAUCE_USERNAME and SAUCE_ACCESS_KEY are required');

  const region = (process.env.SAUCE_REGION || 'us-west-1') as SauceRegion;
  if (!(region in regionalApi)) throw new Error('SAUCE_REGION must be us-west-1, us-east-4, or eu-central-1');

  const configuredApi = process.env.SAUCE_API_BASE_URL?.trim();
  const apiBaseUrl = httpsUrl('SAUCE_API_BASE_URL', configuredApi || regionalApi[region]);
  const mcpUrl = httpsUrl('SAUCE_MCP_URL', process.env.SAUCE_MCP_URL?.trim() || 'https://mcp.saucelabs.com');

  return {
    username,
    accessKey,
    region,
    apiBaseUrl,
    mcpUrl,
    timeoutMs: intEnv('SAUCE_TIMEOUT_MS', 15000, 1000, 120000),
    maxRetries: intEnv('SAUCE_MAX_RETRIES', 2, 0, 5),
    enableWrites: process.env.SAUCE_ENABLE_WRITES === 'true'
  };
}
