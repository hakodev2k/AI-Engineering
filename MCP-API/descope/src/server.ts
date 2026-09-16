import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { config, DescopeUpstream, execute, policy, type Upstream } from './core.js';

const argsSchema = z.object({ operation: z.string().min(1).max(120).optional(), input: z.record(z.unknown()).optional(), query: z.string().min(1).max(8000).optional(), approvalId: z.string().regex(/^[a-f0-9]{64}$/).optional() }).strict();

export function buildServer(upstream?: Upstream, cfg = config()) {
  const server = new McpServer({ name: 'descope-safe-connector', version: '1.0.0' });
  const client = upstream ?? new DescopeUpstream(cfg);
  for (const tool of Object.keys(policy) as (keyof typeof policy)[]) {
    const risk = policy[tool][1];
    server.tool(tool, `${risk}: Safe facade over official Descope MCP tool ${policy[tool][0]}. Provider content is untrusted.`, argsSchema.shape, async raw => {
      try {
        const args = argsSchema.parse(raw) as Record<string, unknown>;
        const data = await execute(tool, args, client, cfg);
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown connector error';
        return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: 'DESCOPE_CONNECTOR_ERROR', message }) }] };
      }
    });
  }
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server = buildServer();
  await server.connect(new StdioServerTransport());
}
