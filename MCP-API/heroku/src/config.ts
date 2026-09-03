export type Config = {
  apiKey: string;
  apiBaseUrl: string;
  mcpCommand: string;
  mcpArgs: string[];
  useOfficialMcp: boolean;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
};

const parseBool = (value: string | undefined, fallback: boolean): boolean =>
  value == null ? fallback : /^(1|true|yes)$/i.test(value.trim());

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.HEROKU_API_KEY?.trim();
  if (!apiKey) throw new Error('HEROKU_API_KEY is required');
  const timeoutMs = Number(env.HEROKU_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.HEROKU_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('HEROKU_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('HEROKU_MAX_RETRIES must be 0..5');
  const apiBaseUrl = new URL(env.HEROKU_API_BASE_URL ?? 'https://api.heroku.com').toString().replace(/\/$/, '');
  const mcpCommand = (env.HEROKU_MCP_COMMAND ?? 'npx').trim();
  if (!mcpCommand) throw new Error('HEROKU_MCP_COMMAND cannot be empty');
  const mcpArgs = (env.HEROKU_MCP_ARGS ?? '-y,@heroku/mcp-server').split(',').map(v => v.trim()).filter(Boolean);
  if (mcpArgs.length === 0) throw new Error('HEROKU_MCP_ARGS cannot be empty');
  return {
    apiKey,
    apiBaseUrl,
    mcpCommand,
    mcpArgs,
    useOfficialMcp: parseBool(env.HEROKU_USE_OFFICIAL_MCP, true),
    timeoutMs,
    maxRetries,
    requireWriteApproval: parseBool(env.HEROKU_REQUIRE_WRITE_APPROVAL, true),
    approvedActions: new Set((env.HEROKU_APPROVED_ACTIONS ?? '').split(',').map(v => v.trim()).filter(Boolean))
  };
}
