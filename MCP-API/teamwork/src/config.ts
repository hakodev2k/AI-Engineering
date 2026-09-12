export interface Config {
  mcpUrl: string;
  bearerToken: string;
  timeoutMs: number;
  maxReadRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
}

const parseBool = (value: string | undefined, fallback = false): boolean =>
  value === undefined ? fallback : /^(1|true|yes|on)$/i.test(value.trim());

const parsePositiveInt = (name: string, value: string | undefined, fallback: number, max: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > max) throw new Error(`${name} must be an integer between 0 and ${max}`);
  return parsed;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const bearerToken = env.TEAMWORK_MCP_BEARER_TOKEN?.trim();
  if (!bearerToken) throw new Error("TEAMWORK_MCP_BEARER_TOKEN is required");

  const mcpUrl = env.TEAMWORK_MCP_URL?.trim() || "https://mcp.ai.teamwork.com";
  const url = new URL(mcpUrl);
  if (url.protocol !== "https:") throw new Error("TEAMWORK_MCP_URL must use HTTPS");
  if (url.username || url.password) throw new Error("TEAMWORK_MCP_URL must not contain credentials");

  return {
    mcpUrl: url.toString(),
    bearerToken,
    timeoutMs: parsePositiveInt("TEAMWORK_TIMEOUT_MS", env.TEAMWORK_TIMEOUT_MS, 15_000, 120_000),
    maxReadRetries: parsePositiveInt("TEAMWORK_MAX_READ_RETRIES", env.TEAMWORK_MAX_READ_RETRIES, 3, 5),
    allowWrites: parseBool(env.TEAMWORK_ALLOW_WRITES),
    allowHighRisk: parseBool(env.TEAMWORK_ALLOW_HIGH_RISK),
  };
}
