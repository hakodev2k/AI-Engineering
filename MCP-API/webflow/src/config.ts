export type PermissionMode = "read" | "write";

export interface WebflowConfig {
  accessToken: string;
  permissions: PermissionMode;
  requireWriteApproval: boolean;
  allowDestructive: boolean;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
}

const bool = (value: string | undefined, fallback: boolean) => value === undefined ? fallback : value.toLowerCase() === "true";
const int = (value: string | undefined, fallback: number, min: number, max: number) => {
  const parsed = value === undefined ? fallback : Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new Error(`Invalid numeric configuration value: ${value}`);
  return parsed;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): WebflowConfig {
  const accessToken = env.WEBFLOW_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error("WEBFLOW_ACCESS_TOKEN is required.");
  const permissions = (env.WEBFLOW_PERMISSIONS ?? "read").toLowerCase();
  if (permissions !== "read" && permissions !== "write") throw new Error("WEBFLOW_PERMISSIONS must be read or write.");
  return {
    accessToken,
    permissions,
    requireWriteApproval: bool(env.WEBFLOW_REQUIRE_WRITE_APPROVAL, true),
    allowDestructive: bool(env.WEBFLOW_ALLOW_DESTRUCTIVE, false),
    timeoutMs: int(env.WEBFLOW_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: int(env.WEBFLOW_MAX_RETRIES, 2, 0, 5),
    baseUrl: "https://api.webflow.com/v2"
  };
}
