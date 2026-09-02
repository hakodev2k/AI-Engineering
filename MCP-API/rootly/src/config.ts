export type Config = {
  apiToken: string;
  apiBaseUrl: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiToken = env.ROOTLY_API_TOKEN?.trim();
  if (!apiToken) throw new Error('ROOTLY_API_TOKEN is required');
  const timeoutMs = Number(env.ROOTLY_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.ROOTLY_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('ROOTLY_TIMEOUT_MS must be an integer from 1000 to 120000');
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) {
    throw new Error('ROOTLY_MAX_RETRIES must be an integer from 0 to 5');
  }
  return {
    apiToken,
    apiBaseUrl: new URL(env.ROOTLY_API_BASE_URL ?? 'https://api.rootly.com/v1').toString().replace(/\/$/, ''),
    mcpUrl: new URL(env.ROOTLY_MCP_URL ?? 'https://mcp.rootly.com/mcp?tool_profile=slim').toString(),
    timeoutMs,
    maxRetries
  };
}
