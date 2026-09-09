import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { PocketBaseClient } from './client.js';
import { authorize } from './policy.js';
import { buildTools } from './tools.js';

const cfg = loadConfig();
const client = new PocketBaseClient(cfg);
const tools = buildTools(client);
const server = new McpServer({ name: 'pocketbase-connector', version: '1.0.0' });

for (const [name, def] of tools) {
  server.registerTool(
    name,
    {
      description: `${def.description} Risk=${def.risk}. ${def.risk === 'READ' ? 'No connector approval required.' : 'approved=true is required by default after human approval.'}`,
      inputSchema: def.schema.shape
    },
    async (args: any) => {
      try {
        const input = def.schema.parse(args);
        authorize(def.risk, input.approved, {
          requireWriteApproval: cfg.requireWriteApproval,
          destructiveEnabled: cfg.destructiveEnabled
        });
        const result = await def.run(input);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ provider: 'pocketbase', untrusted_data: true, result }, null, 2) }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: error instanceof Error ? error.message : 'Unknown connector error' }]
        };
      }
    }
  );
}

await server.connect(new StdioServerTransport());
