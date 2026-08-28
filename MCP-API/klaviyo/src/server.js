import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema,ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js'; import { authorize } from './policy.js'; import { KlaviyoClient,KlaviyoError } from './client.js'; import { TOOL_DEFINITIONS,stripApproval } from './tools.js';
export function createServer({config=loadConfig(),client=null}={}){
 const api=client||new KlaviyoClient(config); const server=new Server({name:'klaviyo-safe-connector',version:'1.0.0'},{capabilities:{tools:{}}});
 server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOL_DEFINITIONS}));
 server.setRequestHandler(CallToolRequestSchema,async(req,extra)=>{const n=req.params.name,a=req.params.arguments||{},p=stripApproval(a); try{authorize(config,n,p,a.approval_token); const s=extra?.signal; let r;
 switch(n){case'klaviyo.profile.list':r=await api.profiles(p,s);break;case'klaviyo.profile.get':r=await api.profile(a.id,s);break;case'klaviyo.list.list':r=await api.lists(p,s);break;case'klaviyo.list.get':r=await api.list(a.id,s);break;case'klaviyo.segment.list':r=await api.segments(p,s);break;case'klaviyo.segment.get':r=await api.segment(a.id,s);break;case'klaviyo.metric.list':r=await api.metrics(p,s);break;case'klaviyo.metric.get':r=await api.metric(a.id,s);break;case'klaviyo.event.list':r=await api.events(p,s);break;case'klaviyo.event.create':r=await api.createEvent(p,s);break;case'klaviyo.campaign.list':r=await api.campaigns(p,s);break;case'klaviyo.campaign.get':r=await api.campaign(a.id,s);break;default:throw new Error(`Unknown tool: ${n}`);} const out={untrusted_provider_data:true,...r}; return{content:[{type:'text',text:JSON.stringify(out)}],structuredContent:out};
 }catch(e){const detail=e instanceof KlaviyoError?{status:e.status,code:e.code,rateLimit:e.rateLimit}:{};return{isError:true,content:[{type:'text',text:JSON.stringify({error:e.message,...detail})}]};}}); return server;}
if(import.meta.url===`file://${process.argv[1]}`){const server=createServer();await server.connect(new StdioServerTransport());}
