export interface PlausibleConfig {
  statsApiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowEventWrites: boolean;
}

function int(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${name} must be a non-negative integer`);
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): PlausibleConfig {
  const statsApiKey = env.PLAUSIBLE_STATS_API_KEY?.trim();
  if (!statsApiKey) throw new Error("PLAUSIBLE_STATS_API_KEY is required");
  const rawBase = env.PLAUSIBLE_BASE_URL?.trim() || "https://plausible.io";
  const base = new URL(rawBase);
  if (base.protocol !== "https:") throw new Error("PLAUSIBLE_BASE_URL must use https");
  return {
    statsApiKey,
    baseUrl: base.origin,
    timeoutMs: int("PLAUSIBLE_TIMEOUT_MS", env.PLAUSIBLE_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, int("PLAUSIBLE_MAX_RETRIES", env.PLAUSIBLE_MAX_RETRIES, 2)),
    allowEventWrites: env.PLAUSIBLE_ALLOW_EVENT_WRITES === "true"
  };
}
