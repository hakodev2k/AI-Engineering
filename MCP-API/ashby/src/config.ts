export interface Config {
  apiKey?: string;
  mcpAccessToken?: string;
  mcpUrl: string;
  apiBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
  allowPrivateFields: boolean;
  onBehalfOfUserId?: string;
}

function bool(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function integer(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${name} must be between ${min} and ${max}`);
  return value;
}

export function loadConfig(): Config {
  const apiKey = process.env.ASHBY_API_KEY?.trim() || undefined;
  const mcpAccessToken = process.env.ASHBY_MCP_ACCESS_TOKEN?.trim() || undefined;
  if (!apiKey && !mcpAccessToken) throw new Error("Set ASHBY_API_KEY or ASHBY_MCP_ACCESS_TOKEN");
  return {
    apiKey,
    mcpAccessToken,
    mcpUrl: process.env.ASHBY_MCP_URL?.trim() || "https://mcp.ashbyhq.com/mcp/v1",
    apiBaseUrl: (process.env.ASHBY_API_BASE_URL?.trim() || "https://api.ashbyhq.com").replace(/\/$/, ""),
    timeoutMs: integer("ASHBY_TIMEOUT_MS", 15_000, 1000, 120_000),
    maxRetries: integer("ASHBY_MAX_RETRIES", 3, 0, 5),
    allowWrites: bool("ASHBY_ALLOW_WRITES"),
    allowHighRisk: bool("ASHBY_ALLOW_HIGH_RISK"),
    allowPrivateFields: bool("ASHBY_ALLOW_PRIVATE_FIELDS"),
    onBehalfOfUserId: process.env.ASHBY_ON_BEHALF_OF_USER_ID?.trim() || undefined
  };
}
