import crypto from "node:crypto";

function intValue(raw, fallback, min, max, name) {
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function boolValue(raw, fallback, name) {
  if (raw === undefined || raw === "") return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(env = process.env) {
  const cliPath = env.RAILWAY_CLI_PATH || "railway";
  if (!/^[A-Za-z0-9_./\\:-]+$/.test(cliPath)) {
    throw new Error("RAILWAY_CLI_PATH contains unsupported characters");
  }
  return Object.freeze({
    cliPath,
    timeoutMs: intValue(env.RAILWAY_MCP_TIMEOUT_MS, 30000, 1000, 120000, "RAILWAY_MCP_TIMEOUT_MS"),
    approvalSecret: env.RAILWAY_APPROVAL_SECRET || "",
    enableHighRisk: boolValue(env.RAILWAY_ENABLE_HIGH_RISK, false, "RAILWAY_ENABLE_HIGH_RISK"),
    enableDestructive: boolValue(env.RAILWAY_ENABLE_DESTRUCTIVE, false, "RAILWAY_ENABLE_DESTRUCTIVE")
  });
}

export function approvalDigest(secret, tool, payload) {
  return crypto.createHmac("sha256", secret)
    .update(`${tool}\n${stableStringify(payload)}`)
    .digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}
