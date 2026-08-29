import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema,ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from '../auth/config.js'; import { MailgunClient,MailgunError } from '../client/mailgun-client.js'; import { sanitize } from '../models/sanitize.js'; import { TOOL_DEFINITIONS,payloadWithoutApproval } from '../tools/definitions.js'; import { authorize } from '../tools/policy.js';
export function createServer({config=loadConfig(),client=null}={}){
 const api=client||new MailgunClient(config); const server=new Server({name:'mailgun-safe-connector',version:'1.0.0'},{capabilities:{tools:{}}});
 server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOL_DEFINITIONS}));
 server.setRequestHandler(CallToolRequestSchema,async(req,extra)=>{ const name=req.params.name,args=req.params.arguments||{},payload=payloadWithoutApproval(args); try{ authorize(config,name,payload,args.approval_token); const s=extra?.signal; let result;
 switch(name){
 case 'mailgun.domain.list':result=await api.listDomains(payload,s);break; case 'mailgun.domain.get':result=await api.getDomain(payload,s);break; case 'mailgun.logs.query':result=await api.queryLogs(payload,s);break; case 'mailgun.metrics.query':result=await api.queryMetrics(payload,s);break; case 'mailgun.template.list':result=await api.listTemplates(payload,s);break; case 'mailgun.template.get':result=await api.getTemplate(payload,s);break; case 'mailgun.template.create':result=await api.createTemplate(payload,s);break; case 'mailgun.mailing_list.list':result=await api.listMailingLists(payload,s);break; case 'mailgun.mailing_list.member.list':result=await api.listMembers(payload,s);break; case 'mailgun.route.list':result=await api.listRoutes(payload,s);break; case 'mailgun.route.get':result=await api.getRoute(payload,s);break; case 'mailgun.suppression.bounce.list':result=await api.listBounces(payload,s);break; case 'mailgun.suppression.complaint.list':result=await api.listComplaints(payload,s);break; case 'mailgun.message.send':result=await api.sendMessage(payload,s);break; default:throw new Error(`Unknown tool: ${name}`); }
 const clean=sanitize(result); return {content:[{type:'text',text:JSON.stringify({untrusted_provider_data:true,data:clean},null,2)}],structuredContent:{untrusted_provider_data:true,data:clean}};
 }catch(e){return {isError:true,content:[{type:'text',text:JSON.stringify(normalize(e))}]};}}); return server;
}
function normalize(e){if(e instanceof MailgunError)return {error:e.message,status:e.status,rateLimit:e.rateLimit,retryAfter:e.retryAfter,retryable:e.status===429||e.status>=500};return {error:e?.message||String(e),retryable:false};}
if(import.meta.url===`file://${process.argv[1]}`){const server=createServer();await server.connect(new StdioServerTransport());}
