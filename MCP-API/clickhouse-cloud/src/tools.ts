export type ToolDef = { name: string; description: string; schema: Record<string, unknown>; transport: "mcp" | "rest"; upstream?: string };

const idSchema = { type: "string", minLength: 1, maxLength: 128, pattern: "^[A-Za-z0-9_-]+$" };
const service = { type: "object", additionalProperties: false, properties: { serviceId: idSchema }, required: ["serviceId"] };
const child = (childName: string) => ({ type: "object", additionalProperties: false, properties: { serviceId: idSchema, [childName]: idSchema }, required: ["serviceId", childName] });

export const TOOLS: readonly ToolDef[] = [
  { name: "clickhouse.database.list", description: "List databases through the official ClickHouse MCP server. READ.", transport: "mcp", upstream: "list_databases", schema: { type: "object", additionalProperties: false, properties: {} } },
  { name: "clickhouse.table.list", description: "List tables in a database through the official ClickHouse MCP server with provider pagination. READ.", transport: "mcp", upstream: "list_tables", schema: { type: "object", additionalProperties: false, properties: { database: { type: "string", minLength: 1, maxLength: 256 }, like: { type: "string", maxLength: 256 }, not_like: { type: "string", maxLength: 256 }, page_token: { type: "string", maxLength: 2048 }, page_size: { type: "integer", minimum: 1, maximum: 200 }, include_detailed_columns: { type: "boolean" } }, required: ["database"] } },
  { name: "clickhouse.query.run_readonly", description: "Execute a ClickHouse SQL query through the official MCP server. Upstream is forced into read-only mode. READ.", transport: "mcp", upstream: "run_query", schema: { type: "object", additionalProperties: false, properties: { query: { type: "string", minLength: 1, maxLength: 100000 } }, required: ["query"] } },
  { name: "clickhouse.cloud.service.list", description: "List ClickHouse Cloud services in the configured organization. READ.", transport: "rest", schema: { type: "object", additionalProperties: false, properties: {} } },
  { name: "clickhouse.cloud.service.get", description: "Get ClickHouse Cloud service details. READ.", transport: "rest", schema: service },
  { name: "clickhouse.cloud.clickpipe.list", description: "List ClickPipes for a service. READ.", transport: "rest", schema: service },
  { name: "clickhouse.cloud.clickpipe.get", description: "Get one ClickPipe. READ.", transport: "rest", schema: child("clickpipeId") },
  { name: "clickhouse.cloud.backup.list", description: "List backups for a service. READ.", transport: "rest", schema: service },
  { name: "clickhouse.cloud.backup.get", description: "Get backup details. READ.", transport: "rest", schema: child("backupId") },
  { name: "clickhouse.cloud.backup_configuration.get", description: "Get service backup configuration. READ.", transport: "rest", schema: service },
  { name: "clickhouse.cloud.clickstack.source.list", description: "List Managed ClickStack sources for a service. READ.", transport: "rest", schema: service },
  { name: "clickhouse.cloud.clickstack.webhook.list", description: "List Managed ClickStack webhook destinations for a service. READ.", transport: "rest", schema: service }
] as const;

export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
