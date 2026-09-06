export type Permission = 'read' | 'write' | 'destructive';

export interface AttioConfig {
  mcpUrl: URL;
  accessToken: string;
  permissions: Set<Permission>;
  requireWriteApproval: boolean;
  approvalSecret?: string;
  timeoutMs: number;
}

function bool(env: NodeJS.ProcessEnv, name: string, fallback: boolean): boolean {
  const v = env[name];
  if (v === undefined) return fallback;
  if (/^(1|true|yes)$/i.test(v)) return true;
  if (/^(0|false|no)$/i.test(v)) return false;
  throw new Error(`${name} must be true or false.`);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AttioConfig {
  const accessToken = env.ATTIO_MCP_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error('ATTIO_MCP_ACCESS_TOKEN is required. Supply an OAuth access token obtained for Attio MCP; never pass it through prompts or tool arguments.');
  const rawUrl = env.ATTIO_MCP_URL?.trim() || 'https://mcp.attio.com/mcp';
  const mcpUrl = new URL(rawUrl);
  if (mcpUrl.protocol !== 'https:' || mcpUrl.hostname !== 'mcp.attio.com' || mcpUrl.pathname !== '/mcp') {
    throw new Error('ATTIO_MCP_URL must be the official https://mcp.attio.com/mcp endpoint.');
  }
  const permissions = new Set<Permission>((env.ATTIO_PERMISSIONS || 'read').split(',').map(v => v.trim().toLowerCase()).filter(Boolean) as Permission[]);
  for (const p of permissions) if (!['read', 'write', 'destructive'].includes(p)) throw new Error(`Unsupported ATTIO_PERMISSIONS value: ${p}`);
  const timeoutMs = Number(env.ATTIO_TIMEOUT_MS || 20000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('ATTIO_TIMEOUT_MS must be an integer from 1000 to 120000.');
  return {
    mcpUrl,
    accessToken,
    permissions,
    requireWriteApproval: bool(env, 'ATTIO_REQUIRE_WRITE_APPROVAL', true),
    approvalSecret: env.ATTIO_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs
  };
}
