export type ToolRisk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface ToolPolicy {
  permission: string;
  risk: ToolRisk;
  approvalRequired: boolean;
  output: string;
  errors: string[];
}

export const TOOL_POLICY: Record<string, ToolPolicy> = {
  'snowflake.database.list': { permission: 'USAGE/visibility on databases', risk: 'READ', approvalRequired: false, output: 'Snowflake SHOW DATABASES result', errors: ['auth', 'rate_limit', 'network', 'provider'] },
  'snowflake.schema.list': { permission: 'USAGE/visibility on database and schemas', risk: 'READ', approvalRequired: false, output: 'Snowflake SHOW SCHEMAS result', errors: ['validation', 'permission', 'provider'] },
  'snowflake.table.list': { permission: 'USAGE/visibility on database and schema', risk: 'READ', approvalRequired: false, output: 'Snowflake SHOW TABLES result', errors: ['validation', 'permission', 'provider'] },
  'snowflake.table.describe': { permission: 'USAGE plus visibility on table', risk: 'READ', approvalRequired: false, output: 'DESCRIBE TABLE result', errors: ['validation', 'permission', 'provider'] },
  'snowflake.table.sample': { permission: 'SELECT on table', risk: 'READ', approvalRequired: false, output: 'Limited table rows', errors: ['validation', 'permission', 'provider'] },
  'snowflake.warehouse.list': { permission: 'warehouse visibility', risk: 'READ', approvalRequired: false, output: 'SHOW WAREHOUSES result', errors: ['permission', 'provider'] },
  'snowflake.query.execute_read': { permission: 'SELECT/read privileges for referenced objects', risk: 'READ', approvalRequired: false, output: 'MCP tool result or SQL API result/status handle', errors: ['validation', 'permission', 'timeout', 'rate_limit', 'mcp_failure', 'provider'] },
  'snowflake.query.status': { permission: 'access to submitted statement', risk: 'READ', approvalRequired: false, output: 'Statement status/result partition', errors: ['validation', 'permission', 'provider'] },
  'snowflake.query.partition.get': { permission: 'access to submitted statement', risk: 'READ', approvalRequired: false, output: 'Requested result partition', errors: ['validation', 'permission', 'provider'] },
  'snowflake.query.cancel': { permission: 'ability to cancel submitted statement', risk: 'HIGH_RISK', approvalRequired: true, output: 'Cancel status', errors: ['approval', 'validation', 'permission', 'provider'] },
  'snowflake.row.insert': { permission: 'INSERT on target table', risk: 'WRITE', approvalRequired: true, output: 'SQL API insert result/status handle', errors: ['approval', 'validation', 'permission', 'provider'] }
};
