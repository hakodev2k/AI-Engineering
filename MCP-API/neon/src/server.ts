import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { NeonMcpClient } from './neonMcp.js';
import { assertAllowed, TOOL_POLICY } from './policy.js';
import { assertId, assertReadOnlySql, cleanName } from './validate.js';

const config = loadConfig();
const upstream = new NeonMcpClient(config);
const server = new McpServer({ name: 'neon-connector', version: '1.0.0' });

function output(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] };
}
async function invoke(tool: string, args: Record<string, unknown>, approvalId?: string) {
  assertAllowed(tool, config, approvalId);
  const result = await upstream.call(TOOL_POLICY[tool].upstream, args);
  return output(result);
}

server.tool('neon.project.list', 'List Neon projects.', { limit: z.number().int().min(1).max(100).default(10), search: z.string().max(200).optional() }, async ({ limit, search }) => invoke('neon.project.list', { limit, ...(search ? { search } : {}) }));
server.tool('neon.project.get', 'Describe a Neon project.', { projectId: z.string() }, async ({ projectId }) => { assertId(projectId, 'projectId'); return invoke('neon.project.get', { projectId }); });
server.tool('neon.project.create', 'Create a Neon project. Requires approval and write mode.', { name: z.string(), regionId: z.string().optional(), approvalId: z.string().optional() }, async ({ name, regionId, approvalId }) => invoke('neon.project.create', { name: cleanName(name, 'name'), ...(regionId ? { regionId } : {}) }, approvalId));
server.tool('neon.project.delete', 'Delete a Neon project and all resources. Destructive; requires approval.', { projectId: z.string(), approvalId: z.string() }, async ({ projectId, approvalId }) => { assertId(projectId, 'projectId'); return invoke('neon.project.delete', { projectId }, approvalId); });

server.tool('neon.branch.get', 'Describe a Neon branch.', { projectId: z.string(), branchId: z.string() }, async ({ projectId, branchId }) => { assertId(projectId, 'projectId'); assertId(branchId, 'branchId'); return invoke('neon.branch.get', { projectId, branchId }); });
server.tool('neon.branch.create', 'Create an isolated Neon database branch. Requires approval and write mode.', { projectId: z.string(), name: z.string().optional(), parentBranchId: z.string().optional(), approvalId: z.string().optional() }, async ({ projectId, name, parentBranchId, approvalId }) => { assertId(projectId, 'projectId'); if (parentBranchId) assertId(parentBranchId, 'parentBranchId'); return invoke('neon.branch.create', { projectId, ...(name ? { branchName: cleanName(name, 'name') } : {}), ...(parentBranchId ? { parentBranchId } : {}) }, approvalId); });
server.tool('neon.branch.delete', 'Delete a Neon branch. Destructive; requires approval.', { projectId: z.string(), branchId: z.string(), approvalId: z.string() }, async ({ projectId, branchId, approvalId }) => { assertId(projectId, 'projectId'); assertId(branchId, 'branchId'); return invoke('neon.branch.delete', { projectId, branchId }, approvalId); });
server.tool('neon.branch.compute.list', 'List compute endpoints for a project or branch.', { projectId: z.string(), branchId: z.string().optional() }, async ({ projectId, branchId }) => { assertId(projectId, 'projectId'); if (branchId) assertId(branchId, 'branchId'); return invoke('neon.branch.compute.list', { projectId, ...(branchId ? { branchId } : {}) }); });

const dbCommon = { projectId: z.string(), branchId: z.string().optional(), databaseName: z.string().optional() };
server.tool('neon.database.table.list', 'List database tables.', dbCommon, async ({ projectId, branchId, databaseName }) => { assertId(projectId, 'projectId'); if (branchId) assertId(branchId, 'branchId'); return invoke('neon.database.table.list', { projectId, ...(branchId ? { branchId } : {}), ...(databaseName ? { databaseName: cleanName(databaseName, 'databaseName') } : {}) }); });
server.tool('neon.database.table.describe', 'Describe a database table schema.', { ...dbCommon, tableName: z.string() }, async ({ projectId, branchId, databaseName, tableName }) => { assertId(projectId, 'projectId'); if (branchId) assertId(branchId, 'branchId'); return invoke('neon.database.table.describe', { projectId, ...(branchId ? { branchId } : {}), ...(databaseName ? { databaseName: cleanName(databaseName, 'databaseName') } : {}), tableName: cleanName(tableName, 'tableName') }); });
server.tool('neon.database.query.read', 'Run one read-only SQL statement. Mutating SQL is rejected locally and by Neon read-only mode when enabled.', { ...dbCommon, sql: z.string().min(1).max(50000) }, async ({ projectId, branchId, databaseName, sql }) => { assertId(projectId, 'projectId'); if (branchId) assertId(branchId, 'branchId'); assertReadOnlySql(sql); return invoke('neon.database.query.read', { projectId, ...(branchId ? { branchId } : {}), ...(databaseName ? { databaseName: cleanName(databaseName, 'databaseName') } : {}), sql }); });
server.tool('neon.database.query.explain', 'Explain a SQL statement execution plan.', { ...dbCommon, sql: z.string().min(1).max(50000) }, async ({ projectId, branchId, databaseName, sql }) => { assertId(projectId, 'projectId'); if (branchId) assertId(branchId, 'branchId'); assertReadOnlySql(`EXPLAIN ${sql.replace(/^\s*explain\s+/i, '')}`); return invoke('neon.database.query.explain', { projectId, ...(branchId ? { branchId } : {}), ...(databaseName ? { databaseName: cleanName(databaseName, 'databaseName') } : {}), sql }); });
server.tool('neon.database.query.slow.list', 'List slow queries for performance analysis.', { ...dbCommon, limit: z.number().int().min(1).max(100).default(20) }, async ({ projectId, branchId, databaseName, limit }) => { assertId(projectId, 'projectId'); if (branchId) assertId(branchId, 'branchId'); return invoke('neon.database.query.slow.list', { projectId, ...(branchId ? { branchId } : {}), ...(databaseName ? { databaseName: cleanName(databaseName, 'databaseName') } : {}), limit }); });

const transport = new StdioServerTransport();
process.on('SIGINT', async () => { await upstream.close(); process.exit(0); });
process.on('SIGTERM', async () => { await upstream.close(); process.exit(0); });
await server.connect(transport);
