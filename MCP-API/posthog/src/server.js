import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { PostHogClient, PostHogError } from './client.js';
import { authorize } from './policy.js';
import { TOOLS, stripApproval } from './tools.js';
export function createServer({config=loadConfig(),client=null}={}) {
  const api=client || new PostHogClient(config);
  const server=new Server({name:'posthog-safe-connector',version:'1.0.0'},{capabilities:{tools:{}}});
  server.setRequestHandler(ListToolsRequestSchema, async()=>({tools:TOOLS}));
  server.setRequestHandler(CallToolRequestSchema, async(req)=>{
    const name=req.params.name, args=req.params.arguments||{}, payload=stripApproval(args);
    try {
      authorize(config,name,payload,args.approval_token);
      let r;
      switch(name){
        case 'posthog.project.get': r=await api.project(); break;
        case 'posthog.dashboard.list': r=await api.dashboards({limit:args.limit??20,offset:args.offset??0}); break;
        case 'posthog.dashboard.get': r=await api.dashboard(args.id); break;
        case 'posthog.insight.list': r=await api.insights({limit:args.limit??20,offset:args.offset??0,search:args.search}); break;
        case 'posthog.insight.get': r=await api.insight(args.id); break;
        case 'posthog.feature_flag.list': r=await api.flags({limit:args.limit??20,offset:args.offset??0,search:args.search}); break;
        case 'posthog.feature_flag.get': r=await api.flag(args.id); break;
        case 'posthog.feature_flag.create': { const {key,name:label,active=true,filters,tags}=payload; r=await api.createFlag({key,name:label,active,...(filters?{filters}:{}),...(tags?{tags}:{})}); break; }
        case 'posthog.feature_flag.update': r=await api.updateFlag(payload.id,payload.changes); break;
        case 'posthog.feature_flag.delete': r=await api.deleteFlag(payload.id); break;
        case 'posthog.person.list': r=await api.persons({limit:args.limit??20,offset:args.offset??0,search:args.search}); break;
        case 'posthog.person.get': r=await api.person(args.id); break;
        default: throw new Error(`Unknown tool ${name}`);
      }
      const out={untrusted_provider_data:true,data:r};
      return {content:[{type:'text',text:JSON.stringify(out,null,2)}],structuredContent:out};
    } catch(e) {
      const error=e instanceof PostHogError?{message:e.message,status:e.status,code:e.code,type:e.type,retryAfter:e.retryAfter}:{message:e.message||String(e)};
      return {isError:true,content:[{type:'text',text:JSON.stringify({error})}]};
    }
  });
  return server;
}
if(import.meta.url===`file://${process.argv[1]}`){const s=createServer();await s.connect(new StdioServerTransport());}
