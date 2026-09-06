export type CloseMcpScope = "mcp.read" | "mcp.write_safe" | "mcp.write_destructive";
export type LocalPermission = "read" | "write" | "high_risk";

export interface Config {
  apiKey: string;
  upstreamUrl: string;
  upstreamScope: CloseMcpScope;
  permission: LocalPermission;
  requireWriteApproval: boolean;
  allowHighRisk: boolean;
  timeoutMs: number;
  maxReadRetries: number;
}

const bool = (name: string, fallback: boolean) => {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be true or false.`);
};

const integer = (name: string, fallback: number, min: number, max: number) => {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer from ${min} to ${max}.`);
  return value;
};

export function loadConfig(env = process.env): Config {
  const apiKey = env.CLOSE_API_KEY?.trim();
  if (!apiKey) throw new Error("CLOSE_API_KEY is required.");

  const upstreamScope = (env.CLOSE_MCP_SCOPE ?? "mcp.read") as CloseMcpScope;
  if (!["mcp.read", "mcp.write_safe", "mcp.write_destructive"].includes(upstreamScope)) throw new Error("CLOSE_MCP_SCOPE is invalid.");

  const permission = (env.CLOSE_PERMISSIONS ?? "read") as LocalPermission;
  if (!["read", "write", "high_risk"].includes(permission)) throw new Error("CLOSE_PERMISSIONS is invalid.");

  return {
    apiKey,
    upstreamUrl: "https://mcp.close.com/mcp",
    upstreamScope,
    permission,
    requireWriteApproval: bool("CLOSE_REQUIRE_WRITE_APPROVAL", true),
    allowHighRisk: bool("CLOSE_ALLOW_HIGH_RISK", false),
    timeoutMs: integer("CLOSE_TIMEOUT_MS", 15000, 1000, 120000),
    maxReadRetries: integer("CLOSE_MAX_READ_RETRIES", 2, 0, 5)
  };
}
