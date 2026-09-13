export type AirwallexEnvironment = "sandbox" | "production";
export type GateMode = "allow" | "deny";

export interface AirwallexConfig {
  clientId: string;
  apiKey: string;
  environment: AirwallexEnvironment;
  baseUrl: string;
  loginAs?: string;
  apiVersion: string;
  timeoutMs: number;
  maxRetries: number;
  writeMode: GateMode;
  highRiskMode: GateMode;
}

const toInt = (name: string, value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AirwallexConfig {
  const clientId = env.AIRWALLEX_CLIENT_ID?.trim();
  const apiKey = env.AIRWALLEX_API_KEY?.trim();
  if (!clientId) throw new Error("AIRWALLEX_CLIENT_ID is required");
  if (!apiKey) throw new Error("AIRWALLEX_API_KEY is required");

  const environment = (env.AIRWALLEX_ENV ?? "sandbox") as AirwallexEnvironment;
  if (!(["sandbox", "production"] as const).includes(environment)) throw new Error("AIRWALLEX_ENV must be sandbox or production");
  const parseMode = (name: string, value: string | undefined): GateMode => {
    const mode = (value ?? "deny") as GateMode;
    if (mode !== "allow" && mode !== "deny") throw new Error(`${name} must be allow or deny`);
    return mode;
  };

  return {
    clientId,
    apiKey,
    environment,
    baseUrl: environment === "sandbox" ? "https://api.sandbox.airwallex.com" : "https://api.airwallex.com",
    loginAs: env.AIRWALLEX_LOGIN_AS?.trim() || undefined,
    apiVersion: env.AIRWALLEX_API_VERSION?.trim() || "2025-08-29",
    timeoutMs: toInt("AIRWALLEX_TIMEOUT_MS", env.AIRWALLEX_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, toInt("AIRWALLEX_MAX_RETRIES", env.AIRWALLEX_MAX_RETRIES, 2)),
    writeMode: parseMode("AIRWALLEX_WRITE_MODE", env.AIRWALLEX_WRITE_MODE),
    highRiskMode: parseMode("AIRWALLEX_HIGH_RISK_MODE", env.AIRWALLEX_HIGH_RISK_MODE)
  };
}
