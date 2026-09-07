import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { BunnyClient } from './client.js';
import { buildTools } from './tools.js';

export async function createServer(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch): Promise<McpServer> {
  const config = loadConfig(env);
  const client = new BunnyClient(config, fetchImpl);
  const server = new McpServer({ name: 'bunny-net-connector', version: '1.0.0' });

  for (const tool of buildTools(client, config)) {
    server.tool(tool.name, tool.description, tool.schema as any, async (args: unknown) => {
      try {
        const result = await tool.handler(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ source: 'untrusted-provider-data', data: result }, null, 2),
          }],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown connector error';
        return {
          isError: true,
          content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
        };
      }
    });
  }

  return server;
}

export async function run(): Promise<void> {
  const server = await createServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
