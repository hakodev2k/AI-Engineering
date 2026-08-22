import { z } from 'zod';

const EnvSchema = z.object({
  GRAFANA_URL: z.string().url(),
  GRAFANA_SERVICE_ACCOUNT_TOKEN: z.string().min(1),
  GRAFANA_ORG_ID: z.string().regex(/^\d+$/).optional().or(z.literal('')),
  GRAFANA_MCP_COMMAND: z.string().min(1).default('uvx'),
  GRAFANA_MCP_ARGS: z.string().default('["mcp-grafana","-t","stdio","--enabled-tools","search,datasource,dashboard,folder"]'),
  GRAFANA_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  GRAFANA_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  GRAFANA_APPROVED_ACTIONS: z.string().default('')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  let args: string[];
  try {
    const value = JSON.parse(parsed.GRAFANA_MCP_ARGS);
    if (!Array.isArray(value) || !value.every(x => typeof x === 'string')) throw new Error();
    args = value;
  } catch {
    throw new Error('CONFIG_ERROR: GRAFANA_MCP_ARGS must be a JSON array of strings');
  }
  return {
    url: parsed.GRAFANA_URL.replace(/\/$/, ''),
    token: parsed.GRAFANA_SERVICE_ACCOUNT_TOKEN,
    orgId: parsed.GRAFANA_ORG_ID || undefined,
    mcpCommand: parsed.GRAFANA_MCP_COMMAND,
    mcpArgs: args,
    timeoutMs: parsed.GRAFANA_TIMEOUT_MS,
    approvalMode: parsed.GRAFANA_APPROVAL_MODE,
    approvedActions: new Set(parsed.GRAFANA_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean))
  };
}

export function assertWriteAllowed(config: Config, action: string) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to GRAFANA_APPROVED_ACTIONS`);
  }
}
