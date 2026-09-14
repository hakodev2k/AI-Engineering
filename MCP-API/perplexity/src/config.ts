export type PerplexityConfig = {
  apiKey: string;
  mcpUrl: URL;
  apiBaseUrl: URL;
  timeoutMs: number;
  allowedTools: Set<string>;
};

const KNOWN = new Set(['search','ask','research','reason','search_api','agent','embed','contextual_embed']);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): PerplexityConfig {
  const apiKey = env.PERPLEXITY_API_KEY?.trim();
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY is required');

  const timeoutMs = Number(env.PERPLEXITY_TIMEOUT_MS ?? '20000');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('PERPLEXITY_TIMEOUT_MS must be an integer between 1000 and 120000');
  }

  const allowed = new Set((env.PERPLEXITY_ALLOWED_TOOLS ?? [...KNOWN].join(','))
    .split(',').map(v => v.trim()).filter(Boolean));
  for (const name of allowed) if (!KNOWN.has(name)) throw new Error(`Unknown tool policy entry: ${name}`);

  const mcpUrl = new URL(env.PERPLEXITY_MCP_URL ?? 'https://api.perplexity.ai/mcp');
  const apiBaseUrl = new URL(env.PERPLEXITY_API_BASE_URL ?? 'https://api.perplexity.ai');
  if (mcpUrl.protocol !== 'https:' || apiBaseUrl.protocol !== 'https:') throw new Error('Perplexity endpoints must use HTTPS');
  if (mcpUrl.hostname !== 'api.perplexity.ai' || apiBaseUrl.hostname !== 'api.perplexity.ai') {
    throw new Error('Custom upstream hosts are disabled to prevent SSRF; only api.perplexity.ai is allowed');
  }

  return { apiKey, mcpUrl, apiBaseUrl, timeoutMs, allowedTools: allowed };
}

export function assertEnabled(config: PerplexityConfig, key: string): void {
  if (!config.allowedTools.has(key)) throw new Error(`Capability disabled by PERPLEXITY_ALLOWED_TOOLS: ${key}`);
}
