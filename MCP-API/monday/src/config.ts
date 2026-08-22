import { z } from 'zod';

const EnvSchema = z.object({
  MONDAY_API_TOKEN: z.string().min(1),
  MONDAY_MCP_URL: z.string().url().default('https://mcp.monday.com/mcp'),
  MONDAY_API_URL: z.string().url().default('https://api.monday.com/v2'),
  MONDAY_API_VERSION: z.string().regex(/^\d{4}-\d{2}$/).default('2026-07'),
  MONDAY_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  MONDAY_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  MONDAY_APPROVED_ACTIONS: z.string().default(''),
  MONDAY_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiToken: parsed.MONDAY_API_TOKEN,
    mcpUrl: parsed.MONDAY_MCP_URL,
    apiUrl: parsed.MONDAY_API_URL,
    apiVersion: parsed.MONDAY_API_VERSION,
    timeoutMs: parsed.MONDAY_TIMEOUT_MS,
    approvalMode: parsed.MONDAY_APPROVAL_MODE,
    approvedActions: new Set(parsed.MONDAY_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: parsed.MONDAY_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to MONDAY_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set MONDAY_ALLOW_DESTRUCTIVE=true only after explicit human approval');
  }
}
