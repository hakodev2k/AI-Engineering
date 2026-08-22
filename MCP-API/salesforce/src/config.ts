import { z } from 'zod';

const EnvSchema = z.object({
  SALESFORCE_MCP_ACCESS_TOKEN: z.string().min(1),
  SALESFORCE_ENVIRONMENT: z.enum(['production', 'sandbox']).default('production'),
  SALESFORCE_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  SALESFORCE_APPROVED_ACTIONS: z.string().default(''),
  SALESFORCE_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false'),
  SALESFORCE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(20000)
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const p = EnvSchema.parse(env);
  const sandbox = p.SALESFORCE_ENVIRONMENT === 'sandbox';
  const prefix = sandbox
    ? 'https://api.salesforce.com/platform/mcp/v1/sandbox/platform/'
    : 'https://api.salesforce.com/platform/mcp/v1/platform/';
  return {
    accessToken: p.SALESFORCE_MCP_ACCESS_TOKEN,
    environment: p.SALESFORCE_ENVIRONMENT,
    readUrl: `${prefix}sobject-reads`,
    mutationUrl: `${prefix}sobject-mutations`,
    deleteUrl: `${prefix}sobject-deletes`,
    timeoutMs: p.SALESFORCE_TIMEOUT_MS,
    approvalMode: p.SALESFORCE_APPROVAL_MODE,
    approvedActions: new Set(p.SALESFORCE_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowDestructive: p.SALESFORCE_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: ${action}`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: SALESFORCE_ALLOW_DESTRUCTIVE must be true after explicit human approval');
  }
}
