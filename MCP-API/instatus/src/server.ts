import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'; import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'; import {loadConfig} from './config.js'; import {InstatusClient} from './client.js'; import {registerTools} from './tools.js';
export function createServer(env=process.env){const cfg=loadConfig(env);const s=new McpServer({name:'instatus-connector',version:'1.0.0'});registerTools(s,new InstatusClient(cfg),cfg);return s}
if(process.env.NODE_ENV!=='test'){const s=createServer();await s.connect(new StdioServerTransport())}
