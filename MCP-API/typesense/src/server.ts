import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {loadConfig} from './config.js';
import {TypesenseClient,TypesenseError} from './client.js';
import {buildTools} from './tools.js';
import {authorize} from './policy.js';
const cfg=loadConfig();const api=new TypesenseClient(cfg);const server=new McpServer({name:'typesense-connector',version:'1.0.0'});
for(const t of buildTools(api))server.registerTool(t.name,{description:`${t.description}. Risk=${t.risk}. Required Typesense actions: ${t.permissions.join(', ')}. ${t.risk==='READ'?'No connector approval required.':'Set approved=true only after human approval when policy requires it.'}`,inputSchema:t.schema},async(args:any)=>{try{authorize(t.risk,args.approved,cfg);const result=await t.run(args);return{content:[{type:'text' as const,text:JSON.stringify({provider:'typesense',untrusted_data:true,result},null,2)}]}}catch(e){const err=e instanceof TypesenseError?{code:e.code,status:e.status,retry_after_ms:e.retryAfter,message:e.message}:{code:'CONNECTOR_ERROR',message:e instanceof Error?e.message:'Unknown error'};return{isError:true,content:[{type:'text' as const,text:JSON.stringify(err)}]}}});
await server.connect(new StdioServerTransport());
