import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { AxiomRestClient } from './rest.js';
import { AxiomMcpClient } from './upstream.js';
import { registerTools } from './tools.js';

const config = loadConfig();
const api = new AxiomRestClient(config);
const upstream = new AxiomMcpClient(config);
const server = new McpServer({ name: 'axiom-connector', version: '1.0.0' });
registerTools(server, config, api, upstream);
await server.connect(new StdioServerTransport());
const shutdown = async () => { await upstream.close(); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
