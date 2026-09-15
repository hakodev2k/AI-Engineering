import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config.js';
import { SparkPostClient } from './client.js';
import { buildTools } from './tools.js';

export function createServer(env:NodeJS.ProcessEnv=process.env){
 const config=loadConfig(env); const client=new SparkPostClient(config); const server=new McpServer({name:'sparkpost-connector',version:'1.0.0'});
 for(const t of buildTools(client,config)) server.tool(t.name,t.description,t.schema.shape,async(raw)=>{const input=t.schema.parse(raw);const data=await t.run(input);return {content:[{type:'text' as const,text:JSON.stringify({risk:t.risk,data})}]};});
 return server;
}
if(process.env.NODE_ENV!=='test'){const server=createServer();await server.connect(new StdioServerTransport());}
