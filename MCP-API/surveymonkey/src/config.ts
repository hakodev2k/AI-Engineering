export type Config = {
  accessToken: string;
  apiBaseUrl: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  approvalToken?: string;
};

function intEnv(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer.`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const accessToken = env.SURVEYMONKEY_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error("SURVEYMONKEY_ACCESS_TOKEN is required.");

  const apiBaseUrl = env.SURVEYMONKEY_API_BASE_URL?.trim() || "https://api.surveymonkey.com/v3";
  const parsed = new URL(apiBaseUrl);
  const allowedHosts = ["api.surveymonkey.com", "api.eu.surveymonkey.com", "api.surveymonkey.ca"];
  if (parsed.protocol !== "https:" || !allowedHosts.includes(parsed.hostname) || !parsed.pathname.startsWith("/v3")) {
    throw new Error("SURVEYMONKEY_API_BASE_URL must be an official SurveyMonkey HTTPS v3 API URL.");
  }

  return {
    accessToken,
    apiBaseUrl: apiBaseUrl.replace(/\/$/, ""),
    mcpUrl: env.SURVEYMONKEY_MCP_URL?.trim() || "https://mcp.surveymonkey.com/mcp",
    timeoutMs: intEnv(env, "SURVEYMONKEY_TIMEOUT_MS", 15000),
    maxRetries: Math.min(intEnv(env, "SURVEYMONKEY_MAX_RETRIES", 3), 5),
    allowWrites: env.SURVEYMONKEY_ALLOW_WRITES === "true",
    approvalToken: env.SURVEYMONKEY_APPROVAL_TOKEN
  };
}
