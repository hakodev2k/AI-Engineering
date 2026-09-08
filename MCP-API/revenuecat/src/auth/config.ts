export type RevenueCatConfig = {
  apiKey: string;
  mcpUrl: string;
  apiBaseUrl: string;
  approvalToken?: string;
  timeoutMs: number;
  maxRetries: number;
};

function positiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`Invalid non-negative integer: ${value}`);
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): RevenueCatConfig {
  const apiKey = env.REVENUECAT_API_V2_KEY?.trim();
  if (!apiKey) throw new Error("REVENUECAT_API_V2_KEY is required");

  const mcpUrl = env.REVENUECAT_MCP_URL?.trim() || "https://mcp.revenuecat.ai/mcp";
  const apiBaseUrl = env.REVENUECAT_API_BASE_URL?.trim() || "https://api.revenuecat.com/v2";

  for (const candidate of [mcpUrl, apiBaseUrl]) {
    const url = new URL(candidate);
    if (url.protocol !== "https:") throw new Error("RevenueCat endpoints must use HTTPS");
  }

  return {
    apiKey,
    mcpUrl,
    apiBaseUrl: apiBaseUrl.replace(/\/$/, ""),
    approvalToken: env.REVENUECAT_APPROVAL_TOKEN?.trim() || undefined,
    timeoutMs: positiveInt(env.REVENUECAT_TIMEOUT_MS, 15_000),
    maxRetries: positiveInt(env.REVENUECAT_MAX_RETRIES, 2),
  };
}

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export function requireApproval(config: RevenueCatConfig, risk: Risk, supplied?: string): void {
  if (risk === "READ") return;
  if (!config.approvalToken) {
    throw new Error(`Approval is required for ${risk} operations but REVENUECAT_APPROVAL_TOKEN is not configured`);
  }
  if (!supplied || supplied !== config.approvalToken) {
    throw new Error(`Explicit human approval is required for ${risk} operation`);
  }
}
