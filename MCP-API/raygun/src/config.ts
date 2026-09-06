export type Permission = "read" | "write" | "high_risk" | "destructive";

export interface Config {
  pat: string;
  mcpUrl: string;
  maxPermission: Permission;
  requireWriteApproval: boolean;
  requireHighRiskApproval: boolean;
  enableDestructive: boolean;
  timeoutMs: number;
}

const bool = (name: string, fallback: boolean) => {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be true or false.`);
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const pat = env.RAYGUN_PAT?.trim();
  if (!pat) throw new Error("RAYGUN_PAT is required. Use a least-privilege Raygun Personal Access Token.");
  const mcpUrl = env.RAYGUN_MCP_URL?.trim() || "https://api.raygun.com/v3/mcp";
  const url = new URL(mcpUrl);
  if (url.protocol !== "https:" || url.hostname !== "api.raygun.com" || url.pathname !== "/v3/mcp") {
    throw new Error("RAYGUN_MCP_URL must be the official https://api.raygun.com/v3/mcp endpoint.");
  }
  const allowed: Permission[] = ["read", "write", "high_risk", "destructive"];
  const maxPermission = (env.RAYGUN_MAX_PERMISSION?.trim() || "read") as Permission;
  if (!allowed.includes(maxPermission)) throw new Error("RAYGUN_MAX_PERMISSION is invalid.");
  const timeoutMs = Number(env.RAYGUN_TIMEOUT_MS || "20000");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error("RAYGUN_TIMEOUT_MS must be an integer from 1000 to 120000.");
  const readBool = (name: string, fallback: boolean) => {
    const value = env[name];
    if (value === undefined) return fallback;
    if (value === "true") return true;
    if (value === "false") return false;
    throw new Error(`${name} must be true or false.`);
  };
  return {
    pat,
    mcpUrl,
    maxPermission,
    requireWriteApproval: readBool("RAYGUN_REQUIRE_WRITE_APPROVAL", true),
    requireHighRiskApproval: readBool("RAYGUN_REQUIRE_HIGH_RISK_APPROVAL", true),
    enableDestructive: readBool("RAYGUN_ENABLE_DESTRUCTIVE", false),
    timeoutMs
  };
}
