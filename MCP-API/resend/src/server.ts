import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'; import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'; import { ResendClient } from './client.js'; import { tools } from './tools.js';
const server=new McpServer({name:'daily-resend-connector',version:'1.0.0'});const client=new ResendClient();
for(const t of tools){server.tool(t.name,t.description,t.schema.shape as any,async(args:any)=>{try{const out=await t.run(args,client);return {content:[{type:'text',text:JSON.stringify(out)}]}}catch(e:any){return {isError:true,content:[{type:'text',text:JSON.stringify({error:e.code||'ERROR',message:e.message,status:e.status,retryAfter:e.retryAfter})}]}}})}
await server.connect(new StdioServerTransport());
