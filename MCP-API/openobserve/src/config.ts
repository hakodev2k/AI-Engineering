export type ConnectorConfig = {
  baseUrl: string;
  orgId: string;
  authHeader: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowRestFallback: boolean;
};

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) throw new Error(`Missing required environment variable: ${name}`);
  return value.trim();
}

function parseIntEnv(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`Invalid ${name}`);
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const baseUrl = required("OPENOBSERVE_BASE_URL", env.OPENOBSERVE_BASE_URL).replace(/\/+$/, "");
  const orgId = required("OPENOBSERVE_ORG_ID", env.OPENOBSERVE_ORG_ID);
  const token = env.OPENOBSERVE_AUTH_TOKEN?.trim();
  const email = env.OPENOBSERVE_EMAIL?.trim();
  const password = env.OPENOBSERVE_PASSWORD;
  let authHeader: string;
  if (token) authHeader = `Basic ${token}`;
  else if (email && password) authHeader = `Basic ${Buffer.from(`${email}:${password}`, "utf8").toString("base64")}`;
  else throw new Error("Configure OPENOBSERVE_AUTH_TOKEN or OPENOBSERVE_EMAIL + OPENOBSERVE_PASSWORD");

  const mcpUrl = (env.OPENOBSERVE_MCP_URL?.trim() || `${baseUrl}/api/${encodeURIComponent(orgId)}/mcp`).replace(/\/+$/, "");
  return {
    baseUrl,
    orgId,
    authHeader,
    mcpUrl,
    timeoutMs: parseIntEnv("OPENOBSERVE_TIMEOUT_MS", env.OPENOBSERVE_TIMEOUT_MS, 30_000),
    maxRetries: Math.min(parseIntEnv("OPENOBSERVE_MAX_RETRIES", env.OPENOBSERVE_MAX_RETRIES, 3), 5),
    allowRestFallback: (env.OPENOBSERVE_ALLOW_REST_FALLBACK ?? "true").toLowerCase() === "true"
  };
}
