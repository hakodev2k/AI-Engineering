export interface ConnectorConfig {
  mcpUrl: string;
  accessToken: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  allowHighRisk: boolean;
}

function boolEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(): ConnectorConfig {
  const accessToken = process.env.ONESIGNAL_MCP_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error("ONESIGNAL_MCP_ACCESS_TOKEN is required");

  const mcpUrl = process.env.ONESIGNAL_MCP_URL?.trim() || "https://api.onesignal.com/mcp/oauth";
  const parsed = new URL(mcpUrl);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error("ONESIGNAL_MCP_URL must be an HTTPS URL without embedded credentials");
  }
  if (parsed.hostname !== "api.onesignal.com") {
    throw new Error("ONESIGNAL_MCP_URL host must be api.onesignal.com");
  }

  const timeoutMs = Number(process.env.ONESIGNAL_TIMEOUT_MS || "20000");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error("ONESIGNAL_TIMEOUT_MS must be an integer from 1000 to 120000");
  }

  return {
    mcpUrl: parsed.toString(),
    accessToken,
    timeoutMs,
    requireWriteApproval: boolEnv("ONESIGNAL_REQUIRE_WRITE_APPROVAL", true),
    allowHighRisk: boolEnv("ONESIGNAL_ALLOW_HIGH_RISK", false)
  };
}
