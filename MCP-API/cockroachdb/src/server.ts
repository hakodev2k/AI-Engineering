import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema,ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { assertAllowed } from "./policy.js";
import { ROUTE_BY_EXTERNAL,TOOL_ROUTES } from "./tools.js";
import { createOfficialClient,type UpstreamClient,withTimeout } from "./upstream.js";
function augment(schema:Record<string,unknown>,approval:boolean){if(!approval)return schema;const properties={...((schema.properties as Record<string,unknown>|undefined)??{})};properties.approval={type:"object",additionalProperties:false,properties:{confirmed:{type:"boolean",const:true},reason:{type:"string",minLength:3,maxLength:500}},required:["confirmed","reason"]};const required=Array.from(new Set([...((schema.required as string[]|undefined)??[]),"approval"]));return{...schema,type:"object",properties,required,additionalProperties:false}}
export async function buildServer(upstream?:UpstreamClient){
 const cfg=loadConfig();const client=upstream??await createOfficialClient(cfg);const discovered=await withTimeout(client.listTools(),cfg.timeoutMs);const byName=new Map(discovered.tools.map(t=>[t.name,t]));
 const missing=TOOL_ROUTES.filter(r=>!byName.has(r.upstream));if(missing.length)throw new Error(`Official CockroachDB MCP is missing required curated tools: ${missing.map(x=>x.upstream).join(", ")}`);
 const server=new Server({name:"cockroachdb-connector",version:"1.0.0"},{capabilities:{tools:{}}});
 server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOL_ROUTES.map(r=>{const u=byName.get(r.upstream)!;return{name:r.external,description:`${r.purpose} Risk=${r.risk}. Upstream=official CockroachDB Cloud MCP (${r.upstream}).`,inputSchema:augment(u.inputSchema,r.risk!=="READ")}})}));
 server.setRequestHandler(CallToolRequestSchema,async req=>{const route=ROUTE_BY_EXTERNAL.get(req.params.name);if(!route)throw new Error("Unknown or unapproved CockroachDB tool.");const args={...(req.params.arguments??{})} as Record<string,unknown>;const approval=args.approval as any;delete args.approval;assertAllowed(route.risk,approval,cfg);try{return await withTimeout(client.callTool({name:route.upstream,arguments:args}),cfg.timeoutMs) as never}catch(e){const m=e instanceof Error?e.message:String(e);if(/401|unauthoriz|token/i.test(m))throw new Error("CockroachDB authentication failed. Verify the service-account API key.");if(/403|forbidden|permission|rbac/i.test(m))throw new Error("CockroachDB denied the operation. Verify cluster-scoped Cloud RBAC and MCP consent.");if(/429|rate.?limit|thrott/i.test(m))throw new Error("CockroachDB rate limit reached. Honor the provider retry window; writes are not blindly retried.");throw e}});
 return{server,close:()=>client.close()};
}
async function main(){const x=await buildServer();const transport=new StdioServerTransport();const stop=async()=>{await x.close();process.exit(0)};process.once("SIGINT",stop);process.once("SIGTERM",stop);await x.server.connect(transport)}
if(import.meta.url===`file://${process.argv[1]}`)main().catch(e=>{console.error(e instanceof Error?e.message:e);process.exit(1)});
