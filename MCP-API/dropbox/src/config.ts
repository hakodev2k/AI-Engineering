export type Config = {
  accessToken?: string;
  mcpAccessToken?: string;
  mcpUrl: string;
  approvalSecret?: string;
  requireWriteApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const timeoutMs = Number(env.DROPBOX_TIMEOUT_MS ?? 20000);
  const maxRetries = Number(env.DROPBOX_MAX_RETRIES ?? 3);
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('DROPBOX_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('DROPBOX_MAX_RETRIES must be 0..5');
  const mcpUrl = env.DROPBOX_MCP_URL ?? 'https://mcp.dropbox.com/mcp';
  if (new URL(mcpUrl).hostname !== 'mcp.dropbox.com') throw new Error('DROPBOX_MCP_URL must target mcp.dropbox.com');
  return {
    accessToken: env.DROPBOX_ACCESS_TOKEN,
    mcpAccessToken: env.DROPBOX_MCP_ACCESS_TOKEN,
    mcpUrl,
    approvalSecret: env.DROPBOX_APPROVAL_SECRET,
    requireWriteApproval: (env.DROPBOX_REQUIRE_WRITE_APPROVAL ?? 'true').toLowerCase() !== 'false',
    timeoutMs,
    maxRetries
  };
}
