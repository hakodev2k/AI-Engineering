import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'; import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'; import {handlers} from './tools.js';
const server=new McpServer({name:'weatherapi-connector',version:'1.0.0'});
for(const t of handlers()) server.tool(t.name,t.description,(t.schema as any).shape,async(args:any)=>{try{const data=await t.run(args);return {content:[{type:'text',text:JSON.stringify({risk:t.risk,approvalRequired:t.approval,data})}]};}catch(e:any){return {isError:true,content:[{type:'text',text:JSON.stringify({error:{code:e.code??'INTERNAL',message:e.message,status:e.status,retryAfter:e.retryAfter}})}]};}});
await server.connect(new StdioServerTransport());
