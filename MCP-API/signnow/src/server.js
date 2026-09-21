import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './auth.js';
import { SignNowClient } from './client.js';
import { registerTools } from './tools.js';

export function buildServer({env=process.env,fetchImpl=fetch}={}){
 const config=loadConfig(env);const server=new McpServer({name:'signnow-connector',version:'1.0.0'});registerTools(server,new SignNowClient(config,fetchImpl),config);return server;
}
if(import.meta.url===`file://${process.argv[1]}`){const server=buildServer();await server.connect(new StdioServerTransport());}
