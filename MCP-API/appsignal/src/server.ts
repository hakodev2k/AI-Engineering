import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { AppSignalUpstream } from './upstream.js';
import { executeTool, TOOL_SPECS } from './tools.js';

export function createServer(upstream?: AppSignalUpstream) {
  const config = loadConfig();
  const client = upstream ?? new AppSignalUpstream(config);
  const server = new McpServer({ name: 'appsignal-safe-connector', version: '1.0.0' });

  for (const spec of TOOL_SPECS) {
    const schema = spec.schema as z.ZodObject<any>;
    server.registerTool(
      spec.name,
      {
        description: `${spec.description} Risk=${spec.risk}; approval=${spec.approvalRequired ? 'required' : 'not-required'}.`,
        inputSchema: schema.shape
      },
      async (args: unknown) => {
        try {
          const value = await executeTool(spec, args, client, config);
          return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown connector error';
          return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: message, tool: spec.name }) }] };
        }
      }
    );
  }

  return { server, client };
}

async function main() {
  const { server, client } = createServer();
  const transport = new StdioServerTransport();
  const shutdown = async () => {
    await client.close().catch(() => undefined);
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  await server.connect(transport);
}

if (process.env.NODE_ENV !== 'test') {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
