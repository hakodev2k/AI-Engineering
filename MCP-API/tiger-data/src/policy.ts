import { ConnectorConfig, verifyApproval } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export type ToolPolicy = {
  external: string;
  upstream: string;
  risk: Risk;
  purpose: string;
};

export const TOOL_POLICIES: ToolPolicy[] = [
  { external: 'tigerdata.service.list', upstream: 'service_list', risk: 'READ', purpose: 'List Tiger Cloud database services.' },
  { external: 'tigerdata.service.get', upstream: 'service_get', risk: 'READ', purpose: 'Get one Tiger Cloud service.' },
  { external: 'tigerdata.service.logs', upstream: 'service_logs', risk: 'READ', purpose: 'Read bounded service logs.' },
  { external: 'tigerdata.service.create', upstream: 'service_create', risk: 'WRITE', purpose: 'Create a Tiger Cloud database service.' },
  { external: 'tigerdata.service.fork', upstream: 'service_fork', risk: 'WRITE', purpose: 'Fork an existing service into an independent copy.' },
  { external: 'tigerdata.service.start', upstream: 'service_start', risk: 'HIGH_RISK', purpose: 'Start a stopped service.' },
  { external: 'tigerdata.service.stop', upstream: 'service_stop', risk: 'HIGH_RISK', purpose: 'Stop a running service.' },
  { external: 'tigerdata.service.resize', upstream: 'service_resize', risk: 'HIGH_RISK', purpose: 'Change service compute resources.' },
  { external: 'tigerdata.service.update_password', upstream: 'service_update_password', risk: 'HIGH_RISK', purpose: 'Rotate the service master password.' },
  { external: 'tigerdata.database.schema', upstream: 'db_schema', risk: 'READ', purpose: 'Inspect database schema and TimescaleDB metadata.' },
  { external: 'tigerdata.database.query.read', upstream: 'db_execute_query', risk: 'READ', purpose: 'Execute a strictly read-only SQL query.' },
  { external: 'tigerdata.database.query.write', upstream: 'db_execute_query', risk: 'HIGH_RISK', purpose: 'Execute an explicitly approved SQL mutation.' }
];

export const byExternal = new Map(TOOL_POLICIES.map(x => [x.external, x]));

export function enforcePolicy(config: ConnectorConfig, tool: ToolPolicy, args: Record<string, unknown>): void {
  if (tool.risk === 'READ') return;
  if (!config.allowWrite) throw new Error('Write operations are disabled by TIGER_CONNECTOR_ALLOW_WRITE');
  if (tool.risk === 'HIGH_RISK' && !config.allowHighRisk) {
    throw new Error('High-risk operations are disabled by TIGER_CONNECTOR_ALLOW_HIGH_RISK');
  }
  const approvalRequired = tool.risk === 'HIGH_RISK' || config.requireWriteApproval;
  if (approvalRequired) {
    if (!config.approvalSecret) throw new Error('Approval secret is not configured');
    if (!verifyApproval(config.approvalSecret, tool.external, args, args.approvalToken)) {
      throw new Error('Explicit human approval is required for this exact tool payload');
    }
  }
}

const READ_PREFIX = /^\s*(select|with|show|explain|values)\b/i;
const FORBIDDEN = /\b(insert|update|delete|merge|truncate|alter|drop|create|grant|revoke|copy|call|do|vacuum|reindex|cluster|refresh)\b/i;

export function assertReadOnlySql(args: Record<string, unknown>): void {
  const candidate = ['query', 'sql', 'statement'].map(k => args[k]).find(v => typeof v === 'string');
  if (typeof candidate !== 'string' || candidate.trim().length === 0) {
    throw new Error('Read-query tool requires a SQL string in the upstream query/sql/statement field');
  }
  if (!READ_PREFIX.test(candidate) || FORBIDDEN.test(candidate)) {
    throw new Error('Only read-only SELECT/WITH/SHOW/EXPLAIN/VALUES SQL is allowed by tigerdata.database.query.read');
  }
}

export function stripApproval(args: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...args };
  delete copy.approvalToken;
  return copy;
}
