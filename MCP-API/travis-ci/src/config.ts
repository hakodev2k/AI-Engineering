export type Permission = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface Config {
  token: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowed: Set<Permission>;
  enableWrites: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.TRAVIS_TOKEN?.trim();
  if (!token) throw new Error("TRAVIS_TOKEN is required");
  const baseUrl = (env.TRAVIS_API_BASE_URL || "https://api.travis-ci.com").replace(/\/$/, "");
  const url = new URL(baseUrl);
  if (url.protocol !== "https:") throw new Error("TRAVIS_API_BASE_URL must use HTTPS");
  const allowed = new Set<Permission>((env.TRAVIS_ALLOWED_PERMISSIONS || "READ").split(",").map(x => x.trim()).filter(Boolean) as Permission[]);
  return {
    token,
    baseUrl,
    timeoutMs: Math.min(Math.max(Number(env.TRAVIS_TIMEOUT_MS || 15000), 1000), 60000),
    maxRetries: Math.min(Math.max(Number(env.TRAVIS_MAX_RETRIES || 2), 0), 4),
    allowed,
    enableWrites: env.TRAVIS_ENABLE_WRITES === "true"
  };
}

export function requirePermission(config: Config, permission: Permission, approved = false): void {
  if (!config.allowed.has(permission)) throw new Error(`Permission denied: ${permission}`);
  if (permission !== "READ" && !config.enableWrites) throw new Error("Write operations are disabled by configuration");
  if ((permission === "HIGH_RISK" || permission === "DESTRUCTIVE") && !approved) throw new Error("Explicit human approval is required");
}
