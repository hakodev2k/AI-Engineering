export interface LemonSqueezyConfig {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrite: boolean;
  allowHighRisk: boolean;
}

function int(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
}

function bool(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): LemonSqueezyConfig {
  const apiKey = env.LEMONSQUEEZY_API_KEY?.trim();
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY is required");
  return {
    apiKey,
    baseUrl: "https://api.lemonsqueezy.com/v1",
    timeoutMs: int("LEMONSQUEEZY_TIMEOUT_MS", env.LEMONSQUEEZY_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, int("LEMONSQUEEZY_MAX_RETRIES", env.LEMONSQUEEZY_MAX_RETRIES, 2)),
    allowWrite: bool(env.LEMONSQUEEZY_ALLOW_WRITE),
    allowHighRisk: bool(env.LEMONSQUEEZY_ALLOW_HIGH_RISK)
  };
}
