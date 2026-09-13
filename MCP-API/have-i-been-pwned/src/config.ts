export interface HibpConfig {
  apiKey?: string;
  userAgent: string;
  timeoutMs: number;
  maxRetries: number;
  useOfficialMcp: boolean;
  apiBaseUrl: string;
  passwordsBaseUrl: string;
  mcpUrl: string;
}

function intValue(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): HibpConfig {
  const userAgent = env.HIBP_USER_AGENT?.trim() || "daily-mcp-have-i-been-pwned";
  return {
    apiKey: env.HIBP_API_KEY?.trim() || undefined,
    userAgent,
    timeoutMs: intValue("HIBP_TIMEOUT_MS", env.HIBP_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, intValue("HIBP_MAX_RETRIES", env.HIBP_MAX_RETRIES, 2)),
    useOfficialMcp: env.HIBP_USE_OFFICIAL_MCP?.trim().toLowerCase() !== "false",
    apiBaseUrl: "https://haveibeenpwned.com/api/v3",
    passwordsBaseUrl: "https://api.pwnedpasswords.com",
    mcpUrl: "https://haveibeenpwned.com/mcp"
  };
}
