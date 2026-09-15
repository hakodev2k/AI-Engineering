import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { TelnyxClient } from './client.js';
import { tools } from './tools.js';

const server=new McpServer({name:'telnyx-connector',version:'1.0.0'});
const client=new TelnyxClient();
for(const t of tools){
 server.tool(t.name,t.description,t.schema.shape as any,async(raw:any)=>{
   try{const args=t.schema.parse(raw);const result=await t.run(client,args);return {content:[{type:'text',text:JSON.stringify({provider:'telnyx',untrusted:true,data:result})}]};}
   catch(e:any){return {isError:true,content:[{type:'text',text:JSON.stringify({error:e?.message??'Unknown error',status:e?.status,retryAfter:e?.retryAfter})}]};}
 });
}
await server.connect(new StdioServerTransport());
