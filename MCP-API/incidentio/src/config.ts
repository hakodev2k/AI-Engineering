export interface Config {
  apiKey: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  writeApproved: boolean;
  highRiskApproved: boolean;
}

function positiveInt(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
  return value;
}

function flag(env: NodeJS.ProcessEnv, name: string): boolean {
  return (env[name] ?? "false").toLowerCase() === "true";
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.INCIDENTIO_API_KEY?.trim();
  if (!apiKey) throw new Error("INCIDENTIO_API_KEY is required");
  const mcpUrl = env.INCIDENTIO_MCP_URL?.trim() || "https://mcp.incident.io/mcp";
  const parsed = new URL(mcpUrl);
  if (parsed.protocol !== "https:") throw new Error("INCIDENTIO_MCP_URL must use https");
  if (parsed.hostname !== "mcp.incident.io") throw new Error("INCIDENTIO_MCP_URL host must be mcp.incident.io");
  return {
    apiKey,
    mcpUrl,
    timeoutMs: positiveInt(env, "INCIDENTIO_TIMEOUT_MS", 20_000),
    maxRetries: Math.min(positiveInt(env, "INCIDENTIO_MAX_RETRIES", 2), 5),
    writeApproved: flag(env, "INCIDENTIO_WRITE_APPROVED"),
    highRiskApproved: flag(env, "INCIDENTIO_HIGH_RISK_APPROVED")
  };
}
