export type Config = {
  apiKey: string;
  apiVersion: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  approvalToken?: string;
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
  const apiKey = env.STATSIG_CONSOLE_API_KEY?.trim();
  if (!apiKey) throw new Error("STATSIG_CONSOLE_API_KEY is required.");
  return {
    apiKey,
    apiVersion: env.STATSIG_API_VERSION?.trim() || "20240601",
    timeoutMs: intEnv(env, "STATSIG_TIMEOUT_MS", 15000),
    maxRetries: Math.min(intEnv(env, "STATSIG_MAX_RETRIES", 3), 5),
    allowWrites: env.STATSIG_ALLOW_WRITES === "true",
    approvalToken: env.STATSIG_APPROVAL_TOKEN,
    mcpUrl: env.STATSIG_MCP_URL?.trim() || "https://api.statsig.com/v1/mcp"
  };
}
