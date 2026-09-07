export type SmartsheetRegion = "us" | "eu" | "au";

export type Config = {
  apiToken: string;
  region: SmartsheetRegion;
  mcpUrl: string;
  timeoutMs: number;
  approvalSecret?: string;
  requireWriteApproval: boolean;
};

const ENDPOINTS: Record<SmartsheetRegion, string> = {
  us: "https://mcp.smartsheet.com",
  eu: "https://mcp.smartsheet.eu",
  au: "https://mcp.smartsheet.au"
};

function intFrom(env: NodeJS.ProcessEnv, name: string, fallback: number, min: number, max: number): number {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiToken = env.SMARTSHEET_API_TOKEN?.trim();
  if (!apiToken) throw new Error("SMARTSHEET_API_TOKEN is required.");

  const region = (env.SMARTSHEET_REGION?.trim().toLowerCase() || "us") as SmartsheetRegion;
  if (!(region in ENDPOINTS)) throw new Error("SMARTSHEET_REGION must be one of: us, eu, au.");

  return {
    apiToken,
    region,
    mcpUrl: ENDPOINTS[region],
    timeoutMs: intFrom(env, "SMARTSHEET_TIMEOUT_MS", 15000, 1000, 120000),
    approvalSecret: env.SMARTSHEET_APPROVAL_SECRET?.trim() || undefined,
    requireWriteApproval: env.SMARTSHEET_REQUIRE_WRITE_APPROVAL !== "false"
  };
}

export function officialEndpoint(region: SmartsheetRegion): string {
  return ENDPOINTS[region];
}
