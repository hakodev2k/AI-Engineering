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
  if (value == null || value === "") return fallback;
  return /^(1|true|yes)$/i.test(value);
}

function int(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(): Config {
  const apiKey = process.env.PANDADOC_API_KEY?.trim();
  if (!apiKey) throw new Error("PANDADOC_API_KEY is required");

  const baseUrl = (process.env.PANDADOC_API_BASE_URL ?? "https://api.pandadoc.com/public/v1").replace(/\/$/, "");
  if (baseUrl !== "https://api.pandadoc.com/public/v1" && baseUrl !== "https://api.pandadoc.eu/public/v1") {
    throw new Error("PANDADOC_API_BASE_URL must be the official PandaDoc global or EU API base URL");
  }

  return {
    apiKey,
    baseUrl,
    timeoutMs: int("PANDADOC_TIMEOUT_MS", 15000, 1000, 120000),
    maxRetries: int("PANDADOC_MAX_RETRIES", 3, 0, 5),
    allowWrites: bool("PANDADOC_ALLOW_WRITES"),
    allowHighRisk: bool("PANDADOC_ALLOW_HIGH_RISK")
  };
}
