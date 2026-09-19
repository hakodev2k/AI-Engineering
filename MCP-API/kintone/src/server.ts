import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'; import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'; import {loadConfig} from './auth.js'; import {KintoneClient} from './client.js'; import {registerTools} from './tools.js';
export function buildServer(){const cfg=loadConfig();const server=new McpServer({name:'kintone-connector',version:'1.0.0'});registerTools(server,new KintoneClient(cfg),cfg);return server}
if(import.meta.url===`file://${process.argv[1]}`){const server=buildServer();await server.connect(new StdioServerTransport())}
