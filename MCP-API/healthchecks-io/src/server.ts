import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { HealthchecksClient, HealthchecksError } from './client.js';
import { buildTools } from './tools.js';

const config = loadConfig();
const client = new HealthchecksClient(config);
const server = new McpServer({ name: 'healthchecks-io-connector', version: '1.0.0' });

function ok(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
}

for (const tool of buildTools(client, config)) {
  server.tool(tool.name, tool.description, tool.schema.shape, async (args) => {
    try {
      const parsed = tool.schema.parse(args);
      return ok(await tool.run(parsed));
    } catch (error) {
      if (error instanceof HealthchecksError) {
        return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: 'healthchecks_api_error', status: error.status, message: error.message, retryAfter: error.retryAfter }) }] };
      }
      return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: 'connector_error', message: error instanceof Error ? error.message : String(error) }) }] };
    }
  });
}

const transport = new StdioServerTransport();
await server.connect(transport);
