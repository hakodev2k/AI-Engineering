import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { CloudsmithClient, CloudsmithError } from "./client.js";
import { assertAuthorized } from "./policy.js";
import { TOOL_DEFINITIONS, stripApproval } from "./tools.js";

export function createServer({config=loadConfig(), client=null}={}) {
  const api = client || new CloudsmithClient(config);
  const server = new Server({name:"cloudsmith-safe-connector",version:"1.0.0"},{capabilities:{tools:{}}});

  server.setRequestHandler(ListToolsRequestSchema, async()=>({tools:TOOL_DEFINITIONS}));
  server.setRequestHandler(CallToolRequestSchema, async(request, extra)=>{
    const name=request.params.name;
    const args=request.params.arguments||{};
    const payload=stripApproval(args);
    try {
      assertAuthorized(config,name,payload,args.approval_token);
      const signal=extra?.signal;
      let result;
      switch(name){
        case "cloudsmith.namespace.list": result=await api.listNamespaces(defaultPage(payload),signal); break;
        case "cloudsmith.repository.list": result=await api.listRepositories(defaultPage(payload),signal); break;
        case "cloudsmith.package.list": result=await api.listPackages(defaultPage(payload),signal); break;
        case "cloudsmith.package.get": result=await api.getPackage(payload,signal); break;
        case "cloudsmith.package.dependencies": result=await api.dependencies(payload,signal); break;
        case "cloudsmith.package.vulnerabilities": result=await api.vulnerabilities(defaultPage(payload),signal); break;
        case "cloudsmith.package.metrics": result=await api.metrics({...defaultPage(payload),packages:payload.packages?.join(",")},signal); break;
        case "cloudsmith.package.copy": result=await api.copy(payload,signal); break;
        case "cloudsmith.package.move": result=await api.move(payload,signal); break;
        case "cloudsmith.package.quarantine": result=await api.quarantine(payload,signal); break;
        case "cloudsmith.package.release": result=await api.release(payload,signal); break;
        case "cloudsmith.package.delete": result=await api.delete(payload,signal); break;
        default: throw new Error(`Unknown tool: ${name}`);
      }
      const envelope={untrusted_provider_data:true,data:result.data,pagination:result.pagination,rateLimit:result.rateLimit};
      return {content:[{type:"text",text:JSON.stringify(envelope,null,2)}],structuredContent:envelope};
    } catch(error) {
      const body=normalizeError(error);
      return {isError:true,content:[{type:"text",text:JSON.stringify(body)}]};
    }
  });
  return server;
}

function defaultPage(v){ return {...v,page:v.page??1,pageSize:v.pageSize??20}; }

function normalizeError(error){
  if(error instanceof CloudsmithError){
    return {
      error:error.message,
      type:error.status===429?"RATE_LIMIT":error.status===401||error.status===403?"AUTHORIZATION":"PROVIDER",
      status:error.status,
      fields:error.fields,
      rateLimit:error.rateLimit,
      retryable:error.status===429 || (error.status>=500)
    };
  }
  return {error:error?.message||String(error),type:"CONNECTOR",retryable:false};
}

if(import.meta.url===`file://${process.argv[1]}`){
  const server=createServer();
  await server.connect(new StdioServerTransport());
}
