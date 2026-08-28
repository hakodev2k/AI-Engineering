import crypto from "node:crypto";

function intEnv(name, fallback, min, max) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

function boolEnv(name, fallback=false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig() {
  const apiKey = process.env.CLOUDSMITH_API_KEY;
  if (!apiKey) throw new Error("CLOUDSMITH_API_KEY is required");

  const base = new URL(process.env.CLOUDSMITH_API_BASE_URL || "https://api.cloudsmith.io");
  if (base.protocol !== "https:") throw new Error("CLOUDSMITH_API_BASE_URL must use HTTPS");
  if (base.username || base.password) throw new Error("CLOUDSMITH_API_BASE_URL must not contain credentials");
  if ((base.pathname && base.pathname !== "/") || base.search || base.hash) throw new Error("CLOUDSMITH_API_BASE_URL must be an origin without path, query, or fragment");

  return Object.freeze({
    apiKey,
    baseUrl: base.origin,
    timeoutMs: intEnv("CLOUDSMITH_TIMEOUT_MS", 10000, 1000, 120000),
    maxRetries: intEnv("CLOUDSMITH_MAX_RETRIES", 3, 0, 5),
    approvalSecret: process.env.CLOUDSMITH_APPROVAL_SECRET || "",
    enableDestructive: boolEnv("CLOUDSMITH_ENABLE_DESTRUCTIVE", false)
  });
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac("sha256", secret).update(`${tool}\n${stableStringify(payload)}`).digest("hex");
}

function stableStringify(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stableStringify(v[k])}`).join(",")}}`;
}
