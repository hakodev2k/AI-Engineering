import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { StytchClient } from './client.js';
import { executeTool, toolDefinitions } from './tools.js';

export function createServer(config = loadConfig(), client = new StytchClient(config)) {
  const server = new Server(
    { name: 'stytch-safe-connector', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: toolDefinitions }));
  server.setRequestHandler(CallToolRequestSchema, async request => {
    try {
      const result = await executeTool(config, client, request.params.name, request.params.arguments ?? {});
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown connector error';
      return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: message.slice(0, 1500) }) }] };
    }
  });
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
