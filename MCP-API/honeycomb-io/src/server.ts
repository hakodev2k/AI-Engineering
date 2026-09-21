import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'; import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'; import {loadConfig} from './auth.js'; import {HoneycombClient} from './client.js'; import {buildTools} from './tools.js';
export function createServer(){
 const config=loadConfig(); const client=new HoneycombClient(config); const server=new McpServer({name:'honeycomb-io',version:'1.0.0'});
 for(const t of buildTools(client,config.requireWriteApproval)) server.tool(t.name,t.description,(t.schema as any).shape,async(args:any)=>{try{const input=t.schema.parse(args);const out=await t.run(input);return {content:[{type:'text' as const,text:JSON.stringify({ok:true,risk:t.risk,approvalRequired:t.approval,result:out})}]};}catch(e){return {isError:true,content:[{type:'text' as const,text:JSON.stringify({ok:false,error:e instanceof Error?e.message:String(e),risk:t.risk})}]};}});
 return server;
}
if(import.meta.url===`file://${process.argv[1]}`){const server=createServer();await server.connect(new StdioServerTransport());}
