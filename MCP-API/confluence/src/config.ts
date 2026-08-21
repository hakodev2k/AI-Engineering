export type Config = {
  cloudId: string;
  siteUrl?: string;
  email?: string;
  apiToken?: string;
  mcpToken?: string;
  mcpUrl: string;
  requireWriteApproval: boolean;
  timeoutMs: number;
};

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  return value == null ? fallback : value.toLowerCase() === "true";
}

export function loadConfig(env = process.env): Config {
  const cloudId = env.ATLASSIAN_CLOUD_ID?.trim();
  if (!cloudId) throw new Error("ATLASSIAN_CLOUD_ID is required");
  const siteUrl = env.ATLASSIAN_SITE_URL?.replace(/\/$/, "");
  const email = env.ATLASSIAN_EMAIL?.trim();
  const apiToken = env.ATLASSIAN_API_TOKEN?.trim();
  const mcpToken = env.ATLASSIAN_ROVO_MCP_TOKEN?.trim();
  if (!mcpToken && !(siteUrl && email && apiToken)) {
    throw new Error("Configure ATLASSIAN_ROVO_MCP_TOKEN or ATLASSIAN_SITE_URL + ATLASSIAN_EMAIL + ATLASSIAN_API_TOKEN");
  }
  const timeoutMs = Number(env.CONFLUENCE_TIMEOUT_MS ?? "15000");
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error("CONFLUENCE_TIMEOUT_MS must be 1000..120000");
  return {
    cloudId,
    siteUrl,
    email,
    apiToken,
    mcpToken,
    mcpUrl: env.ATLASSIAN_ROVO_MCP_URL?.trim() || "https://mcp.atlassian.com/v1/mcp/authv2",
    requireWriteApproval: bool("CONFLUENCE_REQUIRE_WRITE_APPROVAL", true),
    timeoutMs
  };
}
