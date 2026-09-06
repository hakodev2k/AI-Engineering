import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema,ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { assertAllowed } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";
import { WorkableMcpClient, WorkableMcpError } from "./upstream.js";

const config=loadConfig(); const client=new WorkableMcpClient(config);
const clean=(o:Record<string,unknown>)=>Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined));
const result=(v:unknown)=>({content:[{type:"text" as const,text:JSON.stringify(v,null,2)}]});
export const server=new Server({name:"workable-connector",version:"1.0.0"},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOLS.map(t=>({name:t.name,description:`${t.description} Risk=${t.risk}. Upstream=official Workable MCP.`,inputSchema:t.inputSchema as any}))}));
server.setRequestHandler(CallToolRequestSchema,async req=>{
 const t=TOOL_MAP.get(req.params.name); if(!t) throw new Error("Tool is not exposed by this connector.");
 const parsed=t.schema.parse(req.params.arguments??{}) as Record<string,unknown>; assertAllowed(t.risk,parsed,config);
 const mapped=clean(t.map(parsed,config.account)); if(t.upstream!=="get_accounts"&&!mapped.account) throw new Error("Workable account is required. Set WORKABLE_ACCOUNT or pass account from workable.account.list.");
 try{return result(await client.callTool(t.upstream,mapped,t.retryable));}
 catch(e){if(e instanceof WorkableMcpError){if(e.status===401)throw new Error("Workable authentication failed; renew the OAuth token.");if(e.status===403)throw new Error("Workable denied the operation; verify account permissions/scopes.");if(e.status===429)throw new Error(`Workable rate limited the request.${e.retryAfter?` Retry after ${e.retryAfter}.`:""}`);}throw e;}
});
if(import.meta.url===`file://${process.argv[1]}`){client.initialize().then(()=>server.connect(new StdioServerTransport())).catch(e=>{console.error(e instanceof Error?e.message:e);process.exit(1);});}
