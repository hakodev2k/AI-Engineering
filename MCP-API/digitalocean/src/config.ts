export interface Config {
  token: string;
  approvalSecret?: string;
  allowedDroplets: Set<number>;
  allowedFirewalls: Set<string>;
  timeoutMs: number;
  maxRetries: number;
  mcpEnabled: boolean;
  mcpCommand: string;
  apiBaseUrl: string;
}

const parseIds = (value?: string) => new Set((value ?? '').split(',').map(v => Number(v.trim())).filter(Number.isInteger));
const parseStrings = (value?: string) => new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.DIGITALOCEAN_API_TOKEN;
  if (!token) throw new Error('DIGITALOCEAN_API_TOKEN is required');
  const timeoutMs = Number(env.DIGITALOCEAN_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.DIGITALOCEAN_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('DIGITALOCEAN_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('DIGITALOCEAN_MAX_RETRIES must be 0..5');
  return {
    token,
    approvalSecret: env.DIGITALOCEAN_APPROVAL_SECRET,
    allowedDroplets: parseIds(env.DIGITALOCEAN_ALLOWED_DROPLET_IDS),
    allowedFirewalls: parseStrings(env.DIGITALOCEAN_ALLOWED_FIREWALL_IDS),
    timeoutMs,
    maxRetries,
    mcpEnabled: (env.DIGITALOCEAN_MCP_ENABLED ?? 'true').toLowerCase() !== 'false',
    mcpCommand: env.DIGITALOCEAN_MCP_COMMAND ?? 'npx',
    apiBaseUrl: 'https://api.digitalocean.com/v2'
  };
}

export function assertDropletAllowed(config: Config, id: number) {
  if (config.allowedDroplets.size && !config.allowedDroplets.has(id)) throw new Error(`Droplet not allowed: ${id}`);
}

export function assertFirewallAllowed(config: Config, id: string) {
  if (config.allowedFirewalls.size && !config.allowedFirewalls.has(id)) throw new Error(`Firewall not allowed: ${id}`);
}
