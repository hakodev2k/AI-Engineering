function boolEnv(value, fallback) {
  if (value == null || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean environment value: ${value}`);
}

function intEnv(value, fallback, min, max, name) {
  if (value == null || value === "") return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return parsed;
}

export function loadConfig(env = process.env) {
  const apiKey = env.PORKBUN_API_KEY?.trim();
  const secretApiKey = env.PORKBUN_SECRET_API_KEY?.trim();
  if (!apiKey || !secretApiKey) {
    throw new Error("PORKBUN_API_KEY and PORKBUN_SECRET_API_KEY are required");
  }
  if (!apiKey.startsWith("pk1_") || !secretApiKey.startsWith("sk1_")) {
    throw new Error("Porkbun credentials do not match documented key prefixes");
  }

  const upstreamCommand = env.PORKBUN_UPSTREAM_COMMAND?.trim() || "npx";
  const upstreamPackage = env.PORKBUN_UPSTREAM_PACKAGE?.trim() || "@porkbunllc/mcp-server";
  if (upstreamPackage !== "@porkbunllc/mcp-server") {
    throw new Error("PORKBUN_UPSTREAM_PACKAGE must be the official @porkbunllc/mcp-server package");
  }

  return Object.freeze({
    apiKey,
    secretApiKey,
    approvalSecret: env.PORKBUN_APPROVAL_SECRET || "",
    requireWriteApproval: boolEnv(env.PORKBUN_REQUIRE_WRITE_APPROVAL, true),
    enableDestructive: boolEnv(env.PORKBUN_ENABLE_DESTRUCTIVE, false),
    upstreamCommand,
    upstreamPackage,
    timeoutMs: intEnv(env.PORKBUN_TIMEOUT_MS, 20000, 1000, 120000, "PORKBUN_TIMEOUT_MS"),
    maxReadRetries: intEnv(env.PORKBUN_MAX_READ_RETRIES, 2, 0, 5, "PORKBUN_MAX_READ_RETRIES")
  });
}
