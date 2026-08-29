export function loadConfig(env = process.env) {
  const token = env.MIRO_ACCESS_TOKEN?.trim() || "";
  const tokenFile = env.MIRO_TOKEN_FILE?.trim() || "";
  if (!token && !tokenFile) throw new Error("Set MIRO_ACCESS_TOKEN or MIRO_TOKEN_FILE");
  if (token && tokenFile) throw new Error("Use only one credential mode: MIRO_ACCESS_TOKEN or MIRO_TOKEN_FILE");

  return Object.freeze({
    apiBaseUrl: "https://api.miro.com",
    accessToken: token,
    tokenFile,
    clientId: env.MIRO_CLIENT_ID?.trim() || "",
    clientSecret: env.MIRO_CLIENT_SECRET?.trim() || "",
    timeoutMs: intValue(env.MIRO_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: intValue(env.MIRO_MAX_RETRIES, 3, 0, 5),
    approvalSecret: env.MIRO_APPROVAL_SECRET || "",
    destructiveEnabled: boolValue(env.MIRO_ENABLE_DESTRUCTIVE, false)
  });
}

function boolValue(raw, fallback) {
  if (raw == null || raw === "") return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error("Boolean environment values must be true or false");
}

function intValue(raw, fallback, min, max) {
  if (raw == null || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`Integer environment value must be between ${min} and ${max}`);
  }
  return value;
}
