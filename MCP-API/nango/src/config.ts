export interface Config {
  secretKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
  approvedActionIds: Set<string>;
}

function intEnv(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${name} must be a non-negative integer`);
  return n;
}

function boolEnv(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  if (/^(1|true|yes)$/i.test(value)) return true;
  if (/^(0|false|no)$/i.test(value)) return false;
  throw new Error(`Invalid boolean value: ${value}`);
}

function validateBaseUrl(raw: string): string {
  const url = new URL(raw);
  if (url.protocol !== "https:") throw new Error("NANGO_BASE_URL must use https");
  const host = url.hostname.toLowerCase();
  const blocked = host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local");
  if (blocked) throw new Error("NANGO_BASE_URL must not target loopback/local hosts");
  return url.origin;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const secretKey = env.NANGO_SECRET_KEY?.trim();
  if (!secretKey) throw new Error("NANGO_SECRET_KEY is required");
  return {
    secretKey,
    baseUrl: validateBaseUrl(env.NANGO_BASE_URL?.trim() || "https://api.nango.dev"),
    timeoutMs: intEnv("NANGO_TIMEOUT_MS", env.NANGO_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, intEnv("NANGO_MAX_RETRIES", env.NANGO_MAX_RETRIES, 2)),
    requireWriteApproval: boolEnv(env.NANGO_REQUIRE_WRITE_APPROVAL, true),
    enableDestructive: boolEnv(env.NANGO_ENABLE_DESTRUCTIVE, false),
    approvedActionIds: new Set((env.NANGO_APPROVED_ACTION_IDS || "").split(",").map(x => x.trim()).filter(Boolean))
  };
}
