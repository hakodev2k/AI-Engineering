export type Permission = "read" | "write" | "high_risk" | "destructive";
export type PaddleEnvironment = "sandbox" | "live";

export interface PaddleConfig {
  apiKey: string;
  environment: PaddleEnvironment;
  baseUrl: string;
  permissions: Set<Permission>;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
  timeoutMs: number;
  maxRetries: number;
  webhookSecret?: string;
}

const allowedPermissions = new Set<Permission>(["read", "write", "high_risk", "destructive"]);

function required(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new Error(`${key} is required.`);
  return value;
}

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Expected boolean value, received ${value}.`);
}

function int(value: string | undefined, fallback: number, min: number, max: number, name: string): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  return parsed;
}

function parsePermissions(raw: string | undefined): Set<Permission> {
  const items = (raw ?? "read").split(",").map(x => x.trim()).filter(Boolean) as Permission[];
  if (items.length === 0) throw new Error("PADDLE_PERMISSIONS cannot be empty.");
  for (const item of items) if (!allowedPermissions.has(item)) throw new Error(`Unknown permission: ${item}.`);
  return new Set(items);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): PaddleConfig {
  const apiKey = required(env, "PADDLE_API_KEY");
  const environment = (env.PADDLE_ENVIRONMENT?.trim() || (apiKey.startsWith("pdl_live_") ? "live" : "sandbox")) as PaddleEnvironment;
  if (environment !== "sandbox" && environment !== "live") throw new Error("PADDLE_ENVIRONMENT must be sandbox or live.");

  if (apiKey.startsWith("pdl_live_") && environment !== "live") throw new Error("Live Paddle API key cannot be used against sandbox.");
  if (apiKey.startsWith("pdl_sdbx_") && environment !== "sandbox") throw new Error("Sandbox Paddle API key cannot be used against live.");
  if (!apiKey.startsWith("pdl_live_") && !apiKey.startsWith("pdl_sdbx_") && !env.PADDLE_ENVIRONMENT) {
    throw new Error("Legacy Paddle API keys require explicit PADDLE_ENVIRONMENT.");
  }

  return {
    apiKey,
    environment,
    baseUrl: environment === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com",
    permissions: parsePermissions(env.PADDLE_PERMISSIONS),
    requireWriteApproval: bool(env.PADDLE_REQUIRE_WRITE_APPROVAL, true),
    enableDestructive: bool(env.PADDLE_ENABLE_DESTRUCTIVE, false),
    timeoutMs: int(env.PADDLE_TIMEOUT_MS, 15000, 1000, 120000, "PADDLE_TIMEOUT_MS"),
    maxRetries: int(env.PADDLE_MAX_RETRIES, 2, 0, 5, "PADDLE_MAX_RETRIES"),
    webhookSecret: env.PADDLE_WEBHOOK_SECRET?.trim() || undefined
  };
}
