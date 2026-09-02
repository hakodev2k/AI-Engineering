import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { TypeformMcpClient } from './upstream.js';
import { TypeformRestClient } from './rest.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const mcp = new TypeformMcpClient(config);
const rest = new TypeformRestClient(config);
const server = new McpServer({ name: 'typeform-connector', version: '1.0.0' });
registerTools(server, config, mcp, rest);
await server.connect(new StdioServerTransport());
const shutdown = async () => { await mcp.close(); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
