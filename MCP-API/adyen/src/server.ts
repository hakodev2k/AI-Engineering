import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema,ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { assertAllowed } from './policy.js';
import { TOOL_MAP,TOOLS } from './tools.js';
import { AdyenUpstream } from './upstream.js';

export const config=loadConfig();
export const upstream=new AdyenUpstream(config);
export const server=new Server({name:'adyen-connector',version:'1.0.0'},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOLS.map(t=>({name:t.name,description:`${t.description} Risk=${t.risk}. Upstream=official Adyen MCP.`,inputSchema:t.inputSchema as any}))}));
server.setRequestHandler(CallToolRequestSchema,async req=>{
 const tool=TOOL_MAP.get(req.params.name);if(!tool)throw new Error('Tool is not exposed by this connector.');
 const args=tool.schema.parse(req.params.arguments??{}) as Record<string,unknown>;
 assertAllowed(tool.risk,tool.name,args,config);
 const value=await upstream.call(tool.upstream,args,tool.risk);
 return {content:[{type:'text',text:JSON.stringify({untrusted_provider_data:true,value},null,2)}]};
});
if(import.meta.url===`file://${process.argv[1]}`){server.connect(new StdioServerTransport()).catch(e=>{console.error(e instanceof Error?e.message:e);process.exit(1);});}
