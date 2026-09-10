const OFFICIAL_API = "https://api.vultr.com/v2";

function intEnv(value, fallback, min, max, name) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return n;
}

function boolEnv(value, fallback = false) {
  if (value == null || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error("Boolean environment values must be exactly true or false");
}

export function loadConfig(env = process.env) {
  const apiKey = env.VULTR_API_KEY?.trim();
  if (!apiKey) throw new Error("VULTR_API_KEY is required");
  const base = new URL(env.VULTR_API_BASE_URL || OFFICIAL_API);
  if (base.protocol !== "https:" || base.hostname !== "api.vultr.com" || base.pathname.replace(/\/$/, "") !== "/v2" || base.username || base.password || base.search || base.hash) {
    throw new Error("VULTR_API_BASE_URL must be the official https://api.vultr.com/v2 origin");
  }
  const config = {
    apiKey,
    apiBaseUrl: OFFICIAL_API,
    timeoutMs: intEnv(env.VULTR_TIMEOUT_MS, 15000, 1000, 120000, "VULTR_TIMEOUT_MS"),
    maxRetries: intEnv(env.VULTR_MAX_RETRIES, 2, 0, 5, "VULTR_MAX_RETRIES"),
    requireWriteApproval: boolEnv(env.VULTR_REQUIRE_WRITE_APPROVAL, true),
    enableHighRisk: boolEnv(env.VULTR_ENABLE_HIGH_RISK, false),
    enableDestructive: boolEnv(env.VULTR_ENABLE_DESTRUCTIVE, false),
    approvalSecret: env.VULTR_APPROVAL_SECRET || ""
  };
  return Object.freeze(config);
}

export const OFFICIAL_VULTR_API_BASE_URL = OFFICIAL_API;
