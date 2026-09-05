export type Config = {
  subdomain: string;
  accessToken: string;
  endpoint: string;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
  timeoutMs: number;
  maxReadRetries: number;
};

function required(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new Error(`Missing required environment variable ${key}`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const subdomain = required(env, "BAMBOOHR_SUBDOMAIN");
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/i.test(subdomain)) {
    throw new Error("BAMBOOHR_SUBDOMAIN contains invalid characters");
  }

  const timeoutMs = Number(env.BAMBOOHR_TIMEOUT_MS ?? "15000");
  const maxReadRetries = Number(env.BAMBOOHR_MAX_READ_RETRIES ?? "2");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error("BAMBOOHR_TIMEOUT_MS must be an integer between 1000 and 120000");
  }
  if (!Number.isInteger(maxReadRetries) || maxReadRetries < 0 || maxReadRetries > 5) {
    throw new Error("BAMBOOHR_MAX_READ_RETRIES must be an integer between 0 and 5");
  }

  return {
    subdomain,
    accessToken: required(env, "BAMBOOHR_MCP_ACCESS_TOKEN"),
    endpoint: `https://${subdomain}.bamboohr.com/api/mcp`,
    requireWriteApproval: (env.BAMBOOHR_REQUIRE_WRITE_APPROVAL ?? "true").toLowerCase() !== "false",
    approvedActions: new Set((env.BAMBOOHR_APPROVED_ACTIONS ?? "").split(";").map(v => v.trim()).filter(Boolean)),
    timeoutMs,
    maxReadRetries
  };
}
