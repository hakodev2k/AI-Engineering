import crypto from "node:crypto";

function intFrom(env, name, fallback, min, max) {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function boolFrom(env, name, fallback = false) {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(env = process.env) {
  if (!env.DATABRICKS_HOST) throw new Error("DATABRICKS_HOST is required");
  const host = new URL(env.DATABRICKS_HOST);
  if (host.protocol !== "https:") throw new Error("DATABRICKS_HOST must use HTTPS");
  if (host.username || host.password || host.search || host.hash) {
    throw new Error("DATABRICKS_HOST must not contain credentials, query, or fragment");
  }
  if (host.pathname && host.pathname !== "/") {
    throw new Error("DATABRICKS_HOST must be a workspace origin without a path");
  }

  const oauthConfigured = Boolean(env.DATABRICKS_CLIENT_ID || env.DATABRICKS_CLIENT_SECRET);
  if (oauthConfigured && !(env.DATABRICKS_CLIENT_ID && env.DATABRICKS_CLIENT_SECRET)) {
    throw new Error("DATABRICKS_CLIENT_ID and DATABRICKS_CLIENT_SECRET must be set together");
  }
  if (!oauthConfigured && !env.DATABRICKS_TOKEN) {
    throw new Error("Configure OAuth M2M with DATABRICKS_CLIENT_ID/DATABRICKS_CLIENT_SECRET or fallback DATABRICKS_TOKEN");
  }

  return Object.freeze({
    host: host.origin,
    authMode: oauthConfigured ? "oauth_m2m" : "pat",
    clientId: env.DATABRICKS_CLIENT_ID || "",
    clientSecret: env.DATABRICKS_CLIENT_SECRET || "",
    token: env.DATABRICKS_TOKEN || "",
    timeoutMs: intFrom(env, "DATABRICKS_TIMEOUT_MS", 15000, 1000, 120000),
    maxRetries: intFrom(env, "DATABRICKS_MAX_RETRIES", 3, 0, 5),
    approvalSecret: env.DATABRICKS_APPROVAL_SECRET || "",
    enableClusterTerminate: boolFrom(env, "DATABRICKS_ENABLE_CLUSTER_TERMINATE", false),
    enableJobCancel: boolFrom(env, "DATABRICKS_ENABLE_JOB_CANCEL", false),
    enableSqlCancel: boolFrom(env, "DATABRICKS_ENABLE_SQL_CANCEL", false)
  });
}

export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac("sha256", secret)
    .update(`${tool}\n${stableStringify(payload)}`)
    .digest("hex");
}
