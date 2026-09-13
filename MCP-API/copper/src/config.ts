export interface CopperConfig {
  apiKey: string;
  userEmail: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
}

function boolEnv(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export function loadConfig(): CopperConfig {
  const apiKey = process.env.COPPER_API_KEY?.trim();
  const userEmail = process.env.COPPER_USER_EMAIL?.trim();
  if (!apiKey) throw new Error("COPPER_API_KEY is required");
  if (!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) {
    throw new Error("COPPER_USER_EMAIL must be a valid email address");
  }

  const baseUrl = (process.env.COPPER_BASE_URL ?? "https://api.copper.com/developer_api/v1").replace(/\/+$/, "");
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "api.copper.com") {
    throw new Error("COPPER_BASE_URL must use https://api.copper.com to prevent credential exfiltration");
  }

  return {
    apiKey,
    userEmail,
    baseUrl,
    timeoutMs: intEnv("COPPER_TIMEOUT_MS", 15_000, 1_000, 120_000),
    maxRetries: intEnv("COPPER_MAX_RETRIES", 3, 0, 5),
    allowWrites: boolEnv("COPPER_ALLOW_WRITES"),
    allowHighRisk: boolEnv("COPPER_ALLOW_HIGH_RISK")
  };
}
