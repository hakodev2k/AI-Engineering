import crypto from "node:crypto";

function boolFrom(env, name, fallback) {
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
  const address = env.TEMPORAL_ADDRESS;
  const namespace = env.TEMPORAL_NAMESPACE;
  if (!address) throw new Error("TEMPORAL_ADDRESS is required");
  if (!namespace) throw new Error("TEMPORAL_NAMESPACE is required");
  if (!/^[A-Za-z0-9.\-\[\]:]+:\d{1,5}$/.test(address)) throw new Error("TEMPORAL_ADDRESS must be host:port");
  if (!/^[A-Za-z0-9._-]{1,255}$/.test(namespace)) throw new Error("TEMPORAL_NAMESPACE contains unsupported characters");

  const tls = boolFrom(env, "TEMPORAL_TLS", true);
  if (!tls && !/^(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(address)) {
    throw new Error("TEMPORAL_TLS=false is allowed only for localhost development");
  }

  return Object.freeze({
    address,
    namespace,
    apiKey: env.TEMPORAL_API_KEY || "",
    tls,
    serverNameOverride: env.TEMPORAL_SERVER_NAME_OVERRIDE || "",
    timeoutMs: intFrom(env, "TEMPORAL_TIMEOUT_MS", 10000, 1000, 120000),
    approvalSecret: env.TEMPORAL_APPROVAL_SECRET || "",
    destructiveEnabled: boolFrom(env, "TEMPORAL_ENABLE_DESTRUCTIVE", false)
  });
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac("sha256", secret).update(`${tool}\n${stableStringify(payload)}`).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}
