export type Config = {
  token: string;
  apiHost: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrite: boolean;
  approvedActionIds: Set<string>;
};

function positiveInt(value: string | undefined, fallback: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > max) throw new Error(`Invalid numeric configuration value: ${value}`);
  return parsed;
}

function secureHttpsUrl(value: string, field: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${field} must use HTTPS`);
  return url.toString().replace(/\/$/, "");
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.TINYBIRD_TOKEN?.trim();
  if (!token) throw new Error("TINYBIRD_TOKEN is required");

  return {
    token,
    apiHost: secureHttpsUrl(env.TINYBIRD_API_HOST ?? "https://api.tinybird.co", "TINYBIRD_API_HOST"),
    mcpUrl: secureHttpsUrl(env.TINYBIRD_MCP_URL ?? "https://mcp.tinybird.co", "TINYBIRD_MCP_URL"),
    timeoutMs: positiveInt(env.TINYBIRD_TIMEOUT_MS, 20_000, 120_000),
    maxRetries: positiveInt(env.TINYBIRD_MAX_RETRIES, 3, 5),
    allowWrite: env.TINYBIRD_ALLOW_WRITE === "true",
    approvedActionIds: new Set((env.TINYBIRD_APPROVED_ACTION_IDS ?? "").split(",").map(v => v.trim()).filter(Boolean))
  };
}
