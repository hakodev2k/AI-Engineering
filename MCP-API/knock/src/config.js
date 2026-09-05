function parseBool(value, fallback) {
  if (value == null || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Expected boolean string true/false, received ${value}`);
}
function parseIntBounded(value, fallback, min, max, name) {
  const n = value == null || value === "" ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return n;
}
export function loadConfig(env = process.env) {
  const apiKey = env.KNOCK_API_KEY;
  if (!apiKey) throw new Error("KNOCK_API_KEY is required");
  const baseUrl = (env.KNOCK_API_BASE_URL || "https://api.knock.app/v1").replace(/\/$/, "");
  const u = new URL(baseUrl);
  if (u.protocol !== "https:") throw new Error("KNOCK_API_BASE_URL must use https");
  return {
    apiKey,
    baseUrl,
    timeoutMs: parseIntBounded(env.KNOCK_TIMEOUT_MS, 30000, 1000, 120000, "KNOCK_TIMEOUT_MS"),
    maxReadRetries: parseIntBounded(env.KNOCK_MAX_READ_RETRIES, 3, 0, 5, "KNOCK_MAX_READ_RETRIES"),
    requireWriteApproval: parseBool(env.KNOCK_REQUIRE_WRITE_APPROVAL, true)
  };
}
