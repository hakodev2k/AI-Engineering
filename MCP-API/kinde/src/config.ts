export interface KindeConfig {
  domain: string;
  clientId: string;
  clientSecret: string;
  audience: string;
  scopes: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
}

function required(name: string, value: string | undefined): string {
  const v = value?.trim();
  if (!v) throw new Error(`${name} is required`);
  return v;
}

function trustedHttpsOrigin(name: string, value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || (url.pathname !== "/" && url.pathname !== "")) {
    throw new Error(`${name} must be an HTTPS origin with no credentials, path, query, or fragment`);
  }
  return url.origin;
}

function intValue(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
}

const bool = (value: string | undefined) => value?.trim().toLowerCase() === "true";

export function loadConfig(env: NodeJS.ProcessEnv = process.env): KindeConfig {
  const domain = trustedHttpsOrigin("KINDE_DOMAIN", required("KINDE_DOMAIN", env.KINDE_DOMAIN));
  const audience = required("KINDE_AUDIENCE", env.KINDE_AUDIENCE);
  const audienceUrl = new URL(audience);
  if (audienceUrl.protocol !== "https:" || audienceUrl.origin !== domain) throw new Error("KINDE_AUDIENCE must be an HTTPS audience on KINDE_DOMAIN");
  return {
    domain,
    clientId: required("KINDE_CLIENT_ID", env.KINDE_CLIENT_ID),
    clientSecret: required("KINDE_CLIENT_SECRET", env.KINDE_CLIENT_SECRET),
    audience,
    scopes: env.KINDE_SCOPES?.trim() ?? "read:users create:users update:users read:organizations update:organizations",
    timeoutMs: intValue("KINDE_TIMEOUT_MS", env.KINDE_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, intValue("KINDE_MAX_RETRIES", env.KINDE_MAX_RETRIES, 2)),
    allowWrites: bool(env.KINDE_ALLOW_WRITES),
    allowHighRisk: bool(env.KINDE_ALLOW_HIGH_RISK)
  };
}
