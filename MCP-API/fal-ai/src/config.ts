export type ConnectorConfig = {
  falKey: string;
  mcpUrl: string;
  requireWriteApproval: boolean;
  enableHighRisk: boolean;
  toolTimeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const falKey = env.FAL_KEY?.trim();
  if (!falKey) throw new Error('FAL_KEY is required');

  const mcpUrl = env.FAL_MCP_URL?.trim() || 'https://mcp.fal.ai/mcp';
  const parsed = new URL(mcpUrl);
  if (parsed.protocol !== 'https:') throw new Error('FAL_MCP_URL must use HTTPS');
  if (parsed.hostname !== 'mcp.fal.ai') throw new Error('FAL_MCP_URL host must be mcp.fal.ai');

  const toolTimeoutMs = Number(env.FAL_TOOL_TIMEOUT_MS || '120000');
  if (!Number.isInteger(toolTimeoutMs) || toolTimeoutMs < 1000 || toolTimeoutMs > 900000) {
    throw new Error('FAL_TOOL_TIMEOUT_MS must be an integer between 1000 and 900000');
  }

  return {
    falKey,
    mcpUrl,
    requireWriteApproval: (env.FAL_REQUIRE_WRITE_APPROVAL || 'true').toLowerCase() !== 'false',
    enableHighRisk: (env.FAL_ENABLE_HIGH_RISK || 'false').toLowerCase() === 'true',
    toolTimeoutMs
  };
}
