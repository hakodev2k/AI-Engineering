import { z } from "zod";

const bool = (v: string | undefined, fallback: boolean) => v === undefined ? fallback : /^(1|true|yes)$/i.test(v);
const int = (v: string | undefined, fallback: number) => v === undefined ? fallback : Number.parseInt(v, 10);

export type Permission = "read" | "write" | "send";
export interface Config {
  mcpUrl: string;
  oauthUrl?: string;
  clientId?: string;
  clientSecret?: string;
  staticToken?: string;
  permissions: Set<Permission>;
  requireWriteApproval: boolean;
  enableSend: boolean;
  timeoutMs: number;
  maxRetries: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const permissions = new Set((env.FRONT_PERMISSIONS ?? "read").split(",").map(x => x.trim().toLowerCase()).filter(Boolean) as Permission[]);
  for (const p of permissions) z.enum(["read", "write", "send"]).parse(p);
  const cfg: Config = {
    mcpUrl: env.FRONT_MCP_URL ?? "https://mcp.frontapp.com/mcp",
    oauthUrl: env.FRONT_OAUTH_URL,
    clientId: env.FRONT_CLIENT_ID,
    clientSecret: env.FRONT_CLIENT_SECRET,
    staticToken: env.FRONT_MCP_ACCESS_TOKEN,
    permissions,
    requireWriteApproval: bool(env.FRONT_REQUIRE_WRITE_APPROVAL, true),
    enableSend: bool(env.FRONT_ENABLE_SEND, false),
    timeoutMs: int(env.FRONT_TIMEOUT_MS, 20000),
    maxRetries: int(env.FRONT_MAX_RETRIES, 2)
  };
  if (!cfg.staticToken && !(cfg.oauthUrl && cfg.clientId && cfg.clientSecret)) {
    throw new Error("Configure FRONT_MCP_ACCESS_TOKEN or FRONT_OAUTH_URL + FRONT_CLIENT_ID + FRONT_CLIENT_SECRET.");
  }
  if (!Number.isFinite(cfg.timeoutMs) || cfg.timeoutMs < 1000 || cfg.timeoutMs > 120000) throw new Error("FRONT_TIMEOUT_MS must be 1000..120000.");
  if (!Number.isInteger(cfg.maxRetries) || cfg.maxRetries < 0 || cfg.maxRetries > 5) throw new Error("FRONT_MAX_RETRIES must be 0..5.");
  if (cfg.enableSend && !permissions.has("send")) throw new Error("FRONT_ENABLE_SEND requires FRONT_PERMISSIONS to include send.");
  return cfg;
}
