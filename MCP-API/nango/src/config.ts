export type Config = {
  secretKey: string;
  managementMcpUrl: string;
  requireWriteApproval: boolean;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const secretKey = env.NANGO_SECRET_KEY?.trim();
  if (!secretKey) throw new Error('NANGO_SECRET_KEY is required');
  const managementMcpUrl = env.NANGO_MANAGEMENT_MCP_URL?.trim() || 'https://mcp.nango.dev/mcp';
  const url = new URL(managementMcpUrl);
  if (url.protocol !== 'https:') throw new Error('NANGO_MANAGEMENT_MCP_URL must use HTTPS');
  if (url.hostname !== 'mcp.nango.dev') throw new Error('NANGO_MANAGEMENT_MCP_URL must target mcp.nango.dev');
  const timeoutMs = Number(env.NANGO_TIMEOUT_MS || 20000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid NANGO_TIMEOUT_MS');
  return {
    secretKey,
    managementMcpUrl: url.toString(),
    requireWriteApproval: (env.NANGO_REQUIRE_WRITE_APPROVAL || 'true') !== 'false',
    timeoutMs
  };
}
