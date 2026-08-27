import crypto from "node:crypto";

function intEnv(name, fallback, min, max) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function boolEnv(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig() {
  const urlRaw = process.env.MEILISEARCH_URL;
  const apiKey = process.env.MEILISEARCH_API_KEY;
  if (!urlRaw) throw new Error("MEILISEARCH_URL is required");
  if (!apiKey) throw new Error("MEILISEARCH_API_KEY is required");

  const url = new URL(urlRaw);
  const allowHttp = boolEnv("MEILISEARCH_ALLOW_INSECURE_HTTP", false);
  const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

  if (url.protocol !== "https:" && !(allowHttp && url.protocol === "http:" && local)) {
    throw new Error("MEILISEARCH_URL must use HTTPS; HTTP is allowed only for localhost when MEILISEARCH_ALLOW_INSECURE_HTTP=true");
  }
  if (url.username || url.password) throw new Error("MEILISEARCH_URL must not contain credentials");
  if (url.pathname !== "/" && url.pathname !== "") throw new Error("MEILISEARCH_URL must not contain a path");
  if (url.search || url.hash) throw new Error("MEILISEARCH_URL must not contain query or fragment components");

  return Object.freeze({
    baseUrl: url.origin,
    apiKey,
    timeoutMs: intEnv("MEILISEARCH_TIMEOUT_MS", 10000, 1000, 120000),
    maxRetries: intEnv("MEILISEARCH_MAX_RETRIES", 3, 0, 5),
    approvalSecret: process.env.MEILISEARCH_APPROVAL_SECRET || "",
    enableDestructive: boolEnv("MEILISEARCH_ENABLE_DESTRUCTIVE", false)
  });
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac("sha256", secret)
    .update(`${tool}\n${JSON.stringify(payload)}`)
    .digest("hex");
}
