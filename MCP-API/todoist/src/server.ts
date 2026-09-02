import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { TodoistRestClient } from './rest.js';
import { TodoistMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const rest = new TodoistRestClient(config);
const mcp = new TodoistMcpClient(config);
const server = new McpServer({ name: 'todoist-connector', version: '1.0.0' });
registerTools(server, config, rest, mcp);
await server.connect(new StdioServerTransport());

const shutdown = async () => {
  await mcp.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
