export interface Config {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
  allowConfidential: boolean;
}

function bool(name: string, fallback = false): boolean {
  const value = process.env[name];
  return value === undefined ? fallback : /^(1|true|yes)$/i.test(value);
}

function integer(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer from ${min} to ${max}`);
  return value;
}

export function loadConfig(env = process.env): Config {
  const apiKey = env.LEVER_API_KEY?.trim();
  if (!apiKey) throw new Error("LEVER_API_KEY is required");
  const baseUrl = (env.LEVER_BASE_URL ?? "https://api.lever.co/v1").replace(/\/$/, "");
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw new Error("LEVER_BASE_URL must be an HTTPS URL without credentials");
  return {
    apiKey,
    baseUrl,
    timeoutMs: integer("LEVER_TIMEOUT_MS", 15000, 1000, 120000),
    maxRetries: integer("LEVER_MAX_RETRIES", 2, 0, 5),
    allowWrites: bool("LEVER_ALLOW_WRITES"),
    allowHighRisk: bool("LEVER_ALLOW_HIGH_RISK"),
    allowConfidential: bool("LEVER_ALLOW_CONFIDENTIAL")
  };
}
