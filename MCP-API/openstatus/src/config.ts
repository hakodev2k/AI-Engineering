export type Config = {
  apiKey: string;
  mcpUrl: string;
  timeoutMs: number;
  readRetries: number;
  requireWriteApproval: boolean;
  allowedHosts: Set<string>;
};

function bool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

function integer(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export function loadConfig(): Config {
  const apiKey = process.env.OPENSTATUS_API_KEY?.trim();
  if (!apiKey) throw new Error('OPENSTATUS_API_KEY is required');

  const mcpUrl = process.env.OPENSTATUS_MCP_URL?.trim() || 'https://api.openstatus.dev/mcp';
  const url = new URL(mcpUrl);
  if (url.protocol !== 'https:') throw new Error('OPENSTATUS_MCP_URL must use HTTPS');

  const allowedHosts = new Set(
    (process.env.OPENSTATUS_ALLOWED_MCP_HOSTS || 'api.openstatus.dev')
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!allowedHosts.has(url.hostname.toLowerCase())) {
    throw new Error(`OPENSTATUS_MCP_URL host ${url.hostname} is not allowlisted`);
  }

  return {
    apiKey,
    mcpUrl,
    timeoutMs: integer('OPENSTATUS_REQUEST_TIMEOUT_MS', 15000, 1000, 120000),
    readRetries: integer('OPENSTATUS_READ_RETRIES', 2, 0, 4),
    requireWriteApproval: bool('OPENSTATUS_REQUIRE_WRITE_APPROVAL', true),
    allowedHosts,
  };
}
