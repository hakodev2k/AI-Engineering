import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { PortTokenProvider } from './auth.js';
import { PortMcpClient } from './mcp.js';
import { PortRestClient } from './rest.js';
import { registerTools } from './tools.js';

const cfg = loadConfig();
const tokens = new PortTokenProvider(cfg);
const mcp = new PortMcpClient(cfg,tokens);
const api = new PortRestClient(cfg,tokens);
const server = new McpServer({name:'port-connector',version:'1.0.0'});
registerTools(server,cfg,mcp,api);
await server.connect(new StdioServerTransport());

const stop = async()=>{ await mcp.close(); process.exit(0); };
process.on('SIGINT',stop); process.on('SIGTERM',stop);
