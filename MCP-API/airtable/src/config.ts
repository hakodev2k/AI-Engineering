import crypto from 'node:crypto';

export interface AirtableConfig {
  token: string;
  mcpUrl: string;
  mcpToken?: string;
  useMcp: boolean;
  allowedBases: Set<string>;
  allowedTables: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  apiBase: string;
}

const csv = (v?: string) => new Set((v ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AirtableConfig {
  if (!env.AIRTABLE_TOKEN) throw new Error('AIRTABLE_TOKEN is required');
  const timeoutMs = Number(env.AIRTABLE_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.AIRTABLE_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('AIRTABLE_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('AIRTABLE_MAX_RETRIES must be 0..5');
  return {
    token: env.AIRTABLE_TOKEN,
    mcpUrl: env.AIRTABLE_MCP_URL ?? 'https://mcp.airtable.com/mcp',
    mcpToken: env.AIRTABLE_MCP_TOKEN,
    useMcp: (env.AIRTABLE_USE_MCP ?? 'true').toLowerCase() !== 'false',
    allowedBases: csv(env.AIRTABLE_ALLOWED_BASES),
    allowedTables: csv(env.AIRTABLE_ALLOWED_TABLES),
    approvalSecret: env.AIRTABLE_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    apiBase: 'https://api.airtable.com/v0'
  };
}

export function assertTargetAllowed(config: AirtableConfig, baseId: string, table?: string) {
  if (config.allowedBases.size && !config.allowedBases.has(baseId.toLowerCase())) throw new Error(`Base not allowed: ${baseId}`);
  if (table && config.allowedTables.size) {
    const t = table.toLowerCase();
    if (!config.allowedTables.has(t) && !config.allowedTables.has(`${baseId.toLowerCase()}/${t}`)) throw new Error(`Table not allowed: ${baseId}/${table}`);
  }
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
