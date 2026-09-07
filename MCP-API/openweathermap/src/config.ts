export type Config = {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  mcpUrl: string;
};

const intEnv = (env: NodeJS.ProcessEnv, name: string, fallback: number) => {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer.`);
  return value;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.OPENWEATHER_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY is required.");
  const baseUrl = env.OPENWEATHER_BASE_URL?.trim() || "https://api.openweathermap.org";
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "api.openweathermap.org") {
    throw new Error("OPENWEATHER_BASE_URL must be https://api.openweathermap.org to prevent SSRF.");
  }
  return {
    apiKey,
    baseUrl: parsed.origin,
    timeoutMs: intEnv(env, "OPENWEATHER_TIMEOUT_MS", 15000),
    maxRetries: Math.min(intEnv(env, "OPENWEATHER_MAX_RETRIES", 3), 5),
    mcpUrl: env.OPENWEATHER_MCP_URL?.trim() || "https://mcp.openweathermap.org/mcp"
  };
}
