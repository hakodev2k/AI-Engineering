import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { Env0McpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const upstream = new Env0McpClient(config);
const server = new McpServer({ name: 'ai-engineering-env0-connector', version: '1.0.0' });
registerTools(server, upstream, config);

async function shutdown(): Promise<void> {
  await upstream.close();
  await server.close().catch(() => undefined);
}
process.once('SIGINT', () => void shutdown().finally(() => process.exit(0)));
process.once('SIGTERM', () => void shutdown().finally(() => process.exit(0)));

await server.connect(new StdioServerTransport());
