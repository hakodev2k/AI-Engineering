export type Config = {
  apiKey: string;
  accountId: string;
  apiBase: string;
  mcpUrl: string;
  mcpEnabled: boolean;
  timeoutMs: number;
  maxReadRetries: number;
  requireWriteApproval: boolean;
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

function boundedInt(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

function validateUrl(raw: string, envName: string, allowedHosts: Set<string>): string {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error(`${envName} must use HTTPS`);
  if (!allowedHosts.has(url.hostname)) throw new Error(`${envName} host is not allowlisted`);
  url.username = '';
  url.password = '';
  return url.toString().replace(/\/$/, '');
}

export function loadConfig(): Config {
  const hosts = new Set((process.env.CHECKLY_ALLOWED_API_HOSTS ?? 'api.checklyhq.com').split(',').map(v => v.trim()).filter(Boolean));
  if (hosts.size === 0) throw new Error('CHECKLY_ALLOWED_API_HOSTS must not be empty');
  return {
    apiKey: required('CHECKLY_API_KEY'),
    accountId: required('CHECKLY_ACCOUNT_ID'),
    apiBase: validateUrl(process.env.CHECKLY_API_BASE ?? 'https://api.checklyhq.com', 'CHECKLY_API_BASE', hosts),
    mcpUrl: validateUrl(process.env.CHECKLY_MCP_URL ?? 'https://api.checklyhq.com/mcp', 'CHECKLY_MCP_URL', hosts),
    mcpEnabled: bool('CHECKLY_MCP_ENABLED', true),
    timeoutMs: boundedInt('CHECKLY_REQUEST_TIMEOUT_MS', 15000, 1000, 120000),
    maxReadRetries: boundedInt('CHECKLY_MAX_READ_RETRIES', 3, 0, 5),
    requireWriteApproval: bool('CHECKLY_REQUIRE_WRITE_APPROVAL', true)
  };
}
