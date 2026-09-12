export interface Config {
  apiKey: string;
  authMode: "bearer" | "x-api-key";
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
}

function bool(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function positiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
  return value;
}

export function loadConfig(env = process.env): Config {
  const apiKey = env.SPLIT_API_KEY?.trim();
  if (!apiKey) throw new Error("SPLIT_API_KEY is required");
  const authMode = (env.SPLIT_AUTH_MODE ?? "bearer") as Config["authMode"];
  if (authMode !== "bearer" && authMode !== "x-api-key") throw new Error("SPLIT_AUTH_MODE must be bearer or x-api-key");
  const baseUrl = (env.SPLIT_BASE_URL ?? "https://api.split.io").replace(/\/$/, "");
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:") throw new Error("SPLIT_BASE_URL must use https");
  return {
    apiKey,
    authMode,
    baseUrl,
    timeoutMs: positiveInt("SPLIT_TIMEOUT_MS", 15000),
    maxRetries: positiveInt("SPLIT_MAX_RETRIES", 3),
    allowWrites: bool("SPLIT_ALLOW_WRITES"),
    allowHighRisk: bool("SPLIT_ALLOW_HIGH_RISK")
  };
}
