import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { HarnessClient } from './client.js';
import { registerTools } from './tools.js';

const cfg=loadConfig();
const server=new McpServer({name:'harness-connector',version:'1.0.0'});
registerTools(server,new HarnessClient(cfg));
await server.connect(new StdioServerTransport());
