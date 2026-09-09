import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { authorize } from './policy.js';
import { NangoManagementClient } from './upstream.js';
import { toolDefs, invokeTool } from './tools.js';

const config = loadConfig();
const upstream = new NangoManagementClient(config);
const byName = new Map(toolDefs.map((d) => [d.name, d]));
const server = new Server({ name: 'nango-connector', version: '1.0.0' }, { capabilities: { tools: {} } });

function schemaFor(name: string): Record<string, unknown> {
  switch (name) {
    case 'nango.integration.list': case 'nango.function.list': return { type: 'object', properties: {}, additionalProperties: false };
    case 'nango.integration.get': return { type: 'object', properties: { integration_id: { type: 'string' } }, required: ['integration_id'], additionalProperties: false };
    case 'nango.connection.list': return { type: 'object', properties: { integration_id: { type: 'string' }, connection_id: { type: 'string' }, tags: { type: 'object', additionalProperties: { type: 'string' } } }, additionalProperties: false };
    case 'nango.connect_session.create': return { type: 'object', properties: { allowed_integrations: { type: 'array', minItems: 1, maxItems: 20, items: { type: 'string' } }, tags: { type: 'object', additionalProperties: { type: 'string' } }, approved: { type: 'boolean' } }, required: ['allowed_integrations'], additionalProperties: false };
    case 'nango.log.operation.list': return { type: 'object', properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } }, additionalProperties: false };
    case 'nango.log.operation.get': return { type: 'object', properties: { operation_id: { type: 'string' } }, required: ['operation_id'], additionalProperties: false };
    default: return { type: 'object', additionalProperties: false };
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefs.map((d) => ({
    name: d.name,
    description: `${d.purpose} Permission=${d.requiredScope}. Risk=${d.risk}. ${d.risk === 'READ' ? 'No approval required.' : 'Explicit human approval is required before approved=true.'}`,
    inputSchema: schemaFor(d.name)
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const def = byName.get(request.params.name);
  if (!def) return { isError: true, content: [{ type: 'text', text: 'UNKNOWN_TOOL' }] };
  try {
    const args = request.params.arguments || {};
    authorize(def.risk, typeof (args as any).approved === 'boolean' ? (args as any).approved : undefined, config.requireWriteApproval);
    const result = await invokeTool(upstream, def, args);
    return { content: [{ type: 'text', text: JSON.stringify({ provider: 'nango', untrusted_data: true, result }, null, 2) }] };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    return { isError: true, content: [{ type: 'text', text: message }] };
  }
});

await server.connect(new StdioServerTransport());
