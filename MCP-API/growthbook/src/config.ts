export type Config = {
  apiKey: string;
  apiUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvalSecret?: string;
  enableHighRisk: boolean;
};

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ["1", "true", "yes"].includes(value.toLowerCase());
}

function int(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(): Config {
  const apiKey = process.env.GB_API_KEY?.trim();
  if (!apiKey) throw new Error("GB_API_KEY is required");
  const rawUrl = process.env.GB_API_URL?.trim() || "https://api.growthbook.io";
  const url = new URL(rawUrl);
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("GB_API_URL must use HTTPS (HTTP is allowed only for loopback self-hosting)");
  }
  return {
    apiKey,
    apiUrl: url.toString().replace(/\/$/, ""),
    timeoutMs: int("GROWTHBOOK_TIMEOUT_MS", 15000, 1000, 120000),
    maxRetries: int("GROWTHBOOK_MAX_RETRIES", 2, 0, 5),
    requireWriteApproval: bool("GROWTHBOOK_REQUIRE_WRITE_APPROVAL", true),
    approvalSecret: process.env.GROWTHBOOK_APPROVAL_SECRET,
    enableHighRisk: bool("GROWTHBOOK_ENABLE_HIGH_RISK", false)
  };
}
