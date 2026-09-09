export interface Config {
  apiToken: string;
  mcpUrl: URL;
  timeoutMs: number;
  maxReadRetries: number;
  requireWriteApproval: boolean;
}

function positiveInt(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined || value === '') return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) throw new Error(`${name} must be a positive integer`);
  return n;
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('Boolean configuration values must be true or false');
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiToken = env.FLAGSMITH_API_TOKEN?.trim();
  if (!apiToken) throw new Error('FLAGSMITH_API_TOKEN is required');

  const rawUrl = env.FLAGSMITH_MCP_URL?.trim() || 'https://mcp.flagsmith.com';
  const mcpUrl = new URL(rawUrl);
  if (mcpUrl.protocol !== 'https:') throw new Error('FLAGSMITH_MCP_URL must use HTTPS');
  if (mcpUrl.username || mcpUrl.password) throw new Error('FLAGSMITH_MCP_URL must not contain embedded credentials');

  const allowed = new Set(
    (env.FLAGSMITH_ALLOWED_MCP_HOSTS || 'mcp.flagsmith.com')
      .split(',')
      .map(v => v.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!allowed.has(mcpUrl.hostname.toLowerCase())) {
    throw new Error(`Flagsmith MCP host ${mcpUrl.hostname} is not allowlisted`);
  }

  return {
    apiToken,
    mcpUrl,
    timeoutMs: positiveInt(env.FLAGSMITH_REQUEST_TIMEOUT_MS, 15000, 'FLAGSMITH_REQUEST_TIMEOUT_MS'),
    maxReadRetries: Math.min(positiveInt(env.FLAGSMITH_MAX_READ_RETRIES, 3, 'FLAGSMITH_MAX_READ_RETRIES'), 5),
    requireWriteApproval: parseBool(env.FLAGSMITH_REQUIRE_WRITE_APPROVAL, true),
  };
}
