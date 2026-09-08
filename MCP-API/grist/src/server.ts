import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { GristConfig } from './auth.js';
import type { GristUpstream } from './upstream.js';
import { buildTools } from './tools.js';

export function createServer(config: GristConfig, upstream: GristUpstream) {
  const server = new McpServer({ name: 'grist-connector', version: '1.0.0' });
  for (const tool of buildTools(config, upstream)) {
    server.registerTool(tool.name, {
      description: `${tool.description} Risk=${tool.risk}. Approval=${tool.risk === 'READ' ? 'not required' : 'required'}.`,
      inputSchema: tool.schema,
    }, async (raw: unknown) => {
      try {
        const input = tool.schema.parse(raw);
        const data = await tool.run(input);
        return { content: [{ type: 'text' as const, text: JSON.stringify({ ok: true, data }, null, 2) }] };
      } catch (error) {
        const e = error as any;
        const code = e?.name === 'ZodError' ? 'VALIDATION_ERROR' : e?.name === 'PermissionError' ? 'PERMISSION_DENIED' : 'UPSTREAM_ERROR';
        return {
          isError: true,
          content: [{ type: 'text' as const, text: JSON.stringify({ ok: false, error: { code, message: e?.message ?? String(error), retryable: e?.retryable ?? false } }, null, 2) }],
        };
      }
    });
  }
  return server;
}
