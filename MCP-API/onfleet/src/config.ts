export interface Config {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
}

function bool(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value == null) return fallback;
  return value.toLowerCase() === "true";
}

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
}

export function loadConfig(): Config {
  const apiKey = process.env.ONFLEET_API_KEY?.trim();
  if (!apiKey) throw new Error("ONFLEET_API_KEY is required");
  const baseUrl = (process.env.ONFLEET_BASE_URL ?? "https://onfleet.com/api/v2").replace(/\/$/, "");
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:") throw new Error("ONFLEET_BASE_URL must use HTTPS");
  return {
    apiKey,
    baseUrl,
    timeoutMs: int("ONFLEET_TIMEOUT_MS", 15000),
    maxRetries: Math.min(int("ONFLEET_MAX_RETRIES", 3), 5),
    allowWrites: bool("ONFLEET_ALLOW_WRITES"),
    allowHighRisk: bool("ONFLEET_ALLOW_HIGH_RISK")
  };
}
