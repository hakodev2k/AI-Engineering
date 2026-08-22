import { z } from 'zod';

const EnvSchema = z.object({
  BETTERSTACK_API_TOKEN: z.string().min(1),
  BETTERSTACK_API_BASE_URL: z.string().url().default('https://uptime.betterstack.com'),
  BETTERSTACK_MCP_URL: z.string().url().default('https://mcp.betterstack.com'),
  BETTERSTACK_USE_MCP: z.enum(['true', 'false']).default('true'),
  BETTERSTACK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  BETTERSTACK_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  BETTERSTACK_APPROVED_ACTIONS: z.string().default(''),
  BETTERSTACK_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiToken: parsed.BETTERSTACK_API_TOKEN,
    apiBaseUrl: parsed.BETTERSTACK_API_BASE_URL.replace(/\/$/, ''),
    mcpUrl: parsed.BETTERSTACK_MCP_URL,
    useMcp: parsed.BETTERSTACK_USE_MCP === 'true',
    timeoutMs: parsed.BETTERSTACK_TIMEOUT_MS,
    approvalMode: parsed.BETTERSTACK_APPROVAL_MODE,
    approvedActions: new Set(parsed.BETTERSTACK_APPROVED_ACTIONS.split(',').map(v => v.trim()).filter(Boolean)),
    allowDestructive: parsed.BETTERSTACK_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to BETTERSTACK_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set BETTERSTACK_ALLOW_DESTRUCTIVE=true only after explicit human approval');
  }
}
