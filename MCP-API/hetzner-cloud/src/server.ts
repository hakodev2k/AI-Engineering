import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { HetznerClient } from './client.js';
import { registerTools } from './tools.js';
const server=new McpServer({name:'hetzner-cloud-connector',version:'1.0.0'});
registerTools(server,new HetznerClient());
await server.connect(new StdioServerTransport());
