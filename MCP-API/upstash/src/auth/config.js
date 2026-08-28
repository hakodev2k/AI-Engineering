import crypto from "node:crypto";

function boolFrom(env, name, fallback = false) {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

function intFrom(env, name, fallback, min, max) {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export function loadConfig(env = process.env) {
  const rawUrl = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!rawUrl) throw new Error("UPSTASH_REDIS_REST_URL is required");
  if (!token) throw new Error("UPSTASH_REDIS_REST_TOKEN is required");

  const url = new URL(rawUrl);
  if (url.protocol !== "https:") throw new Error("UPSTASH_REDIS_REST_URL must use HTTPS");
  if (url.username || url.password) throw new Error("UPSTASH_REDIS_REST_URL must not contain credentials");
  if ((url.pathname && url.pathname !== "/") || url.search || url.hash) {
    throw new Error("UPSTASH_REDIS_REST_URL must be an origin without path, query, or fragment");
  }

  const allowCustomHost = boolFrom(env, "UPSTASH_REDIS_ALLOW_CUSTOM_HOST", false);
  if (!allowCustomHost && !(url.hostname === "upstash.io" || url.hostname.endsWith(".upstash.io"))) {
    throw new Error("UPSTASH_REDIS_REST_URL host must end in .upstash.io unless UPSTASH_REDIS_ALLOW_CUSTOM_HOST=true");
  }

  return Object.freeze({
    baseUrl: url.origin,
    token,
    timeoutMs: intFrom(env, "UPSTASH_REDIS_TIMEOUT_MS", 10000, 1000, 120000),
    maxRetries: intFrom(env, "UPSTASH_REDIS_MAX_RETRIES", 3, 0, 5),
    approvalSecret: env.UPSTASH_REDIS_APPROVAL_SECRET || "",
    destructiveEnabled: boolFrom(env, "UPSTASH_REDIS_ENABLE_DESTRUCTIVE", false)
  });
}

export function approvalDigest(secret, tool, payload) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${tool}\n${stableStringify(payload)}`)
    .digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}
