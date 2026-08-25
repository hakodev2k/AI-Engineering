import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { CalendlyConnector, TOOL_DEFS } from './tools.js';

export function createServer() {
  const config = loadConfig();
  const connector = new CalendlyConnector(config);
  const server = new McpServer({ name: 'calendly-connector', version: '1.0.0' });

  for (const def of TOOL_DEFS) {
    server.registerTool(
      def.name,
      {
        title: def.name,
        description: `${def.description} Risk=${connector.policy(def.name)?.risk}. Approval=${connector.policy(def.name)?.approval ? 'required/configurable' : 'not required'}.`,
        inputSchema: def.schema.shape
      },
      async (args) => {
        try {
          const result = await connector.execute(def.name, args);
          return {
            content: [{ type: 'text' as const, text: JSON.stringify({ ok: true, tool: def.name, risk: connector.policy(def.name)?.risk, data: result }) }]
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            isError: true,
            content: [{ type: 'text' as const, text: JSON.stringify({ ok: false, tool: def.name, error: message }) }]
          };
        }
      }
    );
  }
  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
