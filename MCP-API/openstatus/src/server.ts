import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from './config.js';
import { authorize } from './policy.js';
import { OpenStatusUpstream } from './upstream.js';
import { toolDefinitions } from './tools.js';

function safeMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/(x-openstatus-key|authorization|api[_ -]?key)\s*[:=]\s*\S+/gi, '$1=[REDACTED]');
}

export function createServer(config: Config, upstream = new OpenStatusUpstream(config)) {
  const server = new McpServer({ name: 'openstatus-connector', version: '1.0.0' });

  for (const definition of toolDefinitions) {
    server.registerTool(
      definition.name,
      {
        description: `${definition.description} Permission=${definition.risk}. ${definition.risk === 'READ' ? 'No human approval required.' : 'Explicit human approval is required before execution.'}`,
        inputSchema: definition.inputSchema,
      },
      async (input: Record<string, unknown>) => {
        try {
          authorize(definition.risk, input.approved as boolean | undefined, config.requireWriteApproval);
          const args = definition.prepare ? definition.prepare(input) : input;
          const result = await upstream.call(definition.upstream, args, definition.risk);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify({ provider: 'openstatus', untrusted_data: true, result }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text' as const, text: safeMessage(error) }],
          };
        }
      },
    );
  }

  return { server, upstream };
}
