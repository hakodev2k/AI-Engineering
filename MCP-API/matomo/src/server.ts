import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { MatomoReportingClient } from './client.js';
import { MatomoMcpDiscoveryClient } from './mcp.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const api = new MatomoReportingClient(config);
const mcp = new MatomoMcpDiscoveryClient(config);
const server = new McpServer({ name: 'matomo-connector', version: '1.0.0' });
registerTools(server, api, mcp);
await server.connect(new StdioServerTransport());
