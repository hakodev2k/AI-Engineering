import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { SquarespaceClient } from './client.js';
import { buildTools } from './tools.js';

export async function createServer(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch) {
  const config = loadConfig(env);
  const client = new SquarespaceClient(config, fetchImpl);
  const tools = buildTools(client, config);
  const byName = new Map(tools.map(tool => [tool.name, tool]));

  const server = new Server({ name: 'squarespace-safe-connector', version: '1.0.0' }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map(tool => ({
      name: tool.name,
      description: `${tool.description} Risk=${tool.risk}.`,
      inputSchema: tool.inputSchema
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const tool = byName.get(request.params.name);
    if (!tool) return { isError: true, content: [{ type: 'text', text: JSON.stringify({ ok: false, error: 'Unknown tool' }) }] };
    try {
      const result = await tool.handler((request.params.arguments ?? {}) as Record<string, unknown>);
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connector error';
      return { isError: true, content: [{ type: 'text', text: JSON.stringify({ ok: false, error: message }) }] };
    }
  });

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server = await createServer();
  await server.connect(new StdioServerTransport());
}
