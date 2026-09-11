export type Risk = "READ" | "WRITE" | "HIGH_RISK";

export interface FireHydrantConfig {
  apiKey: string;
  baseUrl: string;
  readBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  highRiskEnabled: boolean;
}

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value == null) return fallback;
  return value.toLowerCase() === "true";
}

function integer(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(): FireHydrantConfig {
  const apiKey = process.env.FIREHYDRANT_API_KEY?.trim();
  if (!apiKey) throw new Error("FIREHYDRANT_API_KEY is required");
  const region = (process.env.FIREHYDRANT_REGION ?? "us").toLowerCase();
  if (!["us", "eu"].includes(region)) throw new Error("FIREHYDRANT_REGION must be us or eu");
  return {
    apiKey,
    baseUrl: region === "eu" ? "https://api.eu.firehydrant.io/v1" : "https://api.firehydrant.io/v1",
    readBaseUrl: region === "eu" ? "https://api.eu.firehydrant.io/v1" : "https://api-read.firehydrant.io/v1",
    timeoutMs: integer("FIREHYDRANT_TIMEOUT_MS", 15000, 1000, 120000),
    maxRetries: integer("FIREHYDRANT_MAX_RETRIES", 2, 0, 5),
    requireWriteApproval: bool("FIREHYDRANT_WRITE_APPROVAL_REQUIRED", true),
    highRiskEnabled: bool("FIREHYDRANT_HIGH_RISK_ENABLED", false)
  };
}

export function authorize(config: FireHydrantConfig, risk: Risk, approved: boolean): void {
  if (risk === "READ") return;
  if (risk === "HIGH_RISK" && !config.highRiskEnabled) throw new Error("HIGH_RISK operations are disabled; set FIREHYDRANT_HIGH_RISK_ENABLED=true deliberately");
  if ((config.requireWriteApproval || risk === "HIGH_RISK") && !approved) throw new Error("Explicit human approval is required for this operation");
}
