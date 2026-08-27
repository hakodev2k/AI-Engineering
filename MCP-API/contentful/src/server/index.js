import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema,ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "../auth/config.js";
import { ContentfulUpstream } from "../transport/upstream.js";
import { CATALOG,externalDefinitions,stripApproval } from "../tools/catalog.js";
import { authorize } from "../tools/policy.js";

export function createServer({config=loadConfig(),upstream=null}={}){
  const bridge=upstream||new ContentfulUpstream(config);
  const server=new Server({name:"contentful-safe-connector",version:"1.0.0"},{capabilities:{tools:{}}});
  let cachedDefs=null;
  server.setRequestHandler(ListToolsRequestSchema,async()=>{if(!cachedDefs)cachedDefs=externalDefinitions(await bridge.listTools());return {tools:cachedDefs};});
  server.setRequestHandler(CallToolRequestSchema,async(request)=>{
    const name=request.params.name,args=request.params.arguments||{},payload=stripApproval(args);
    try{
      const meta=CATALOG[name];if(!meta) throw new Error(`Unknown tool: ${name}`);
      authorize(config,name,payload,args.approval_token);
      const result=await bridge.callTool(meta.upstream,payload,{readOnly:meta.risk==="READ"});
      const data=normalizeMcpResult(result);
      return {content:[{type:"text",text:JSON.stringify({untrusted_provider_data:true,upstream:"official-contentful-mcp",data},null,2)}],structuredContent:{untrusted_provider_data:true,upstream:"official-contentful-mcp",data}};
    }catch(error){return {isError:true,content:[{type:"text",text:JSON.stringify({error:classify(error)})}]};}
  });
  return server;
}
function normalizeMcpResult(result){if(!result||typeof result!=="object")return result;return {isError:Boolean(result.isError),structuredContent:result.structuredContent,content:Array.isArray(result.content)?result.content.map(item=>item?.type==="text"?{type:"text",text:item.text}:item):result.content};}
function classify(error){const message=error?.message||String(error),lower=message.toLowerCase();if(lower.includes("approval")||lower.includes("protected")||lower.includes("disabled"))return{type:"POLICY",message,retryable:false};if(lower.includes("401")||lower.includes("403")||lower.includes("unauthorized")||lower.includes("forbidden"))return{type:"AUTHORIZATION",message,retryable:false};if(lower.includes("429")||lower.includes("rate limit"))return{type:"RATE_LIMIT",message,retryable:true};if(lower.includes("timeout")||lower.includes("timed out")||lower.includes("502")||lower.includes("503")||lower.includes("504"))return{type:"UPSTREAM_UNAVAILABLE",message,retryable:true};return{type:"UPSTREAM",message,retryable:false};}
if(import.meta.url===`file://${process.argv[1]}`){const server=createServer();await server.connect(new StdioServerTransport());}
