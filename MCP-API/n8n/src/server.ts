import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, assertProjectAllowed, assertWorkflowAllowed } from './config.js';
import { assertApproval } from './policy.js';
import { N8nRestClient } from './rest-client.js';
import { N8nMcpClient } from './mcp-client.js';

const config = loadConfig();
const rest = new N8nRestClient(config);
const upstream = new N8nMcpClient(config);
const server = new McpServer({ name: 'n8n-mcp-connector', version: '1.0.0' });
const id = z.string().min(1).max(200);
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('n8n.workflow.search', 'Search workflows. Uses official n8n MCP when available, otherwise REST.', {
  query: z.string().max(500).optional(), projectId: id.optional(), tags: z.array(z.string().max(100)).max(50).optional(), limit: z.number().int().min(1).max(200).optional()
}, async a => {
  assertProjectAllowed(config, a.projectId);
  const mcp = await upstream.callIfAvailable('search_workflows', { query: a.query, projectId: a.projectId, tags: a.tags, limit: a.limit });
  if (mcp !== undefined) return out(mcp);
  return out(await rest.get('/workflows', { limit: a.limit, projectId: a.projectId }));
});

server.tool('n8n.workflow.get', 'Get workflow details. Uses official n8n MCP when available, otherwise REST.', { workflowId: id }, async a => {
  assertWorkflowAllowed(config, a.workflowId);
  const mcp = await upstream.callIfAvailable('get_workflow_details', { workflowId: a.workflowId });
  return out(mcp ?? await rest.get(`/workflows/${encodeURIComponent(a.workflowId)}`));
});

server.tool('n8n.workflow.create', 'Create a workflow through the official REST API. Requires approval.', {
  name: z.string().min(1).max(256), nodes: z.array(z.record(z.string(), z.unknown())).min(1).max(500), connections: z.record(z.string(), z.unknown()), settings: z.record(z.string(), z.unknown()).optional(), projectId: id.optional(), approvalId
}, async a => {
  assertProjectAllowed(config, a.projectId); assertApproval('n8n.workflow.create', a.approvalId, config.approvalSecret);
  return out(await rest.post('/workflows', { name: a.name, nodes: a.nodes, connections: a.connections, settings: a.settings ?? {}, projectId: a.projectId }));
});

server.tool('n8n.workflow.update', 'Replace workflow definition through REST. Requires approval.', {
  workflowId: id, name: z.string().min(1).max(256), nodes: z.array(z.record(z.string(), z.unknown())).min(1).max(500), connections: z.record(z.string(), z.unknown()), settings: z.record(z.string(), z.unknown()).optional(), approvalId
}, async a => {
  assertWorkflowAllowed(config, a.workflowId); assertApproval('n8n.workflow.update', a.approvalId, config.approvalSecret);
  return out(await rest.put(`/workflows/${encodeURIComponent(a.workflowId)}`, { name: a.name, nodes: a.nodes, connections: a.connections, settings: a.settings ?? {} }));
});

for (const [tool, action] of [['n8n.workflow.activate','activate'],['n8n.workflow.deactivate','deactivate']] as const) {
  server.tool(tool, `${action} a workflow. Requires approval.`, { workflowId: id, approvalId }, async a => {
    assertWorkflowAllowed(config, a.workflowId); assertApproval(tool, a.approvalId, config.approvalSecret);
    return out(await rest.post(`/workflows/${encodeURIComponent(a.workflowId)}/${action}`));
  });
}

server.tool('n8n.execution.list', 'List executions.', { workflowId: id.optional(), status: z.string().max(50).optional(), limit: z.number().int().min(1).max(100).optional(), cursor: z.string().max(1000).optional() }, async a => {
  assertWorkflowAllowed(config, a.workflowId);
  return out(await rest.get('/executions', { workflowId: a.workflowId, status: a.status, limit: a.limit, cursor: a.cursor }));
});

server.tool('n8n.execution.get', 'Get one execution.', { executionId: id }, async a => out(await rest.get(`/executions/${encodeURIComponent(a.executionId)}`)));
server.tool('n8n.execution.delete', 'Permanently delete an execution. Destructive; requires approval.', { executionId: id, approvalId }, async a => {
  assertApproval('n8n.execution.delete', a.approvalId, config.approvalSecret);
  return out(await rest.delete(`/executions/${encodeURIComponent(a.executionId)}`));
});

server.tool('n8n.tag.list', 'List workflow tags.', { limit: z.number().int().min(1).max(500).optional() }, async a => {
  const mcp = await upstream.callIfAvailable('list_tags', { limit: a.limit });
  return out(mcp ?? await rest.get('/tags', { limit: a.limit }));
});
server.tool('n8n.tag.create', 'Create a workflow tag. Requires approval.', { name: z.string().min(1).max(100), approvalId }, async a => {
  assertApproval('n8n.tag.create', a.approvalId, config.approvalSecret); return out(await rest.post('/tags', { name: a.name }));
});
server.tool('n8n.project.list', 'List projects visible to the API key.', { limit: z.number().int().min(1).max(100).optional() }, async a => out(await rest.get('/projects', { limit: a.limit })));

const shutdown = async () => { await upstream.close(); await server.close(); process.exit(0); };
process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
await server.connect(new StdioServerTransport());
