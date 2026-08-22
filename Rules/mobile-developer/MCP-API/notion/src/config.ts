export type NotionConfig = {
  mcpUrl: string;
  accessToken: string;
  approvalSecret?: string;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): NotionConfig {
  const accessToken = env.NOTION_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error('NOTION_ACCESS_TOKEN is required');

  const mcpUrl = (env.NOTION_MCP_URL || 'https://mcp.notion.com/mcp').trim();
  const parsed = new URL(mcpUrl);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'mcp.notion.com') {
    throw new Error('NOTION_MCP_URL must use the official https://mcp.notion.com host');
  }

  const timeoutMs = Number(env.NOTION_TIMEOUT_MS || 30000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('NOTION_TIMEOUT_MS must be between 1000 and 120000');
  }

  return {
    mcpUrl,
    accessToken,
    approvalSecret: env.NOTION_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs
  };
}
