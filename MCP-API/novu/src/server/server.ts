import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Config } from '../auth/config.js';
import { authorize } from '../models/policy.js';
import type { ToolDef } from '../tools/registry.js';

export function createServer(cfg: Config, tools: Map<string, ToolDef>): Server {
  const server = new Server({ name: 'novu-connector', version: '1.0.0' }, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [...tools.entries()].map(([name, def]) => ({
    name,
    description: `${def.description}. Risk=${def.risk}. ${def.risk === 'READ' ? 'No approval required.' : 'Requires explicit human approval via approved=true.'}`,
    inputSchema: zodToJsonSchema(def.schema, { target: 'jsonSchema7' }) as any
  })) }));
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const def = tools.get(request.params.name);
    if (!def) return { isError: true, content: [{ type: 'text', text: 'UNKNOWN_TOOL' }] };
    try {
      const args = def.schema.parse(request.params.arguments || {});
      authorize(def.risk, args.approved, { requireWriteApproval: cfg.requireWriteApproval, destructiveEnabled: cfg.destructiveEnabled });
      const result = await def.run(args);
      return { content: [{ type: 'text', text: JSON.stringify({ provider: 'novu', untrusted_data: true, result }, null, 2) }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
      return { isError: true, content: [{ type: 'text', text: message.slice(0, 4096) }] };
    }
  });
  return server;
}
