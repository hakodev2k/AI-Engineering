import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LogSnagClient } from './client.js'; import { handlers,eventSchema,identifySchema,insightSchema,mutateSchema } from './tools.js';
const bool=(v:string|undefined,d:boolean)=>v===undefined?d:v.toLowerCase()==='true';
export function buildServer(env=process.env){
 const client=new LogSnagClient({token:env.LOGSNAG_API_TOKEN??'',baseUrl:env.LOGSNAG_API_BASE_URL,timeoutMs:Number(env.LOGSNAG_TIMEOUT_MS??10000),maxRetries:Number(env.LOGSNAG_MAX_RETRIES??2)});
 const h=handlers(client,{defaultProject:env.LOGSNAG_DEFAULT_PROJECT,requireWriteApproval:bool(env.LOGSNAG_REQUIRE_WRITE_APPROVAL,true),allowNotifications:bool(env.LOGSNAG_ALLOW_NOTIFICATIONS,false)});
 const s=new McpServer({name:'logsnag-connector',version:'1.0.0'}); const out=(v:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(v)}]});
 s.tool('logsnag.event.publish','Publish a non-notifying event. WRITE; configurable approval.',eventSchema.shape,async x=>out(await h.eventPublish(x)));
 s.tool('logsnag.event.publish_notification','Publish an event with push notification. HIGH_RISK; explicit approval and server opt-in required.',eventSchema.shape,async x=>out(await h.eventNotify(x)));
 s.tool('logsnag.user.identify','Set/overwrite user profile properties. WRITE; configurable approval.',identifySchema.shape,async x=>out(await h.identify(x)));
 s.tool('logsnag.insight.set','Set the latest value of a realtime insight. WRITE; configurable approval.',insightSchema.shape,async x=>out(await h.insightSet(x)));
 s.tool('logsnag.insight.increment','Increment a numeric insight. WRITE; configurable approval.',mutateSchema.shape,async x=>out(await h.insightIncrement(x)));
 s.tool('logsnag.insight.decrement','Decrement a numeric insight. WRITE; configurable approval.',mutateSchema.shape,async x=>out(await h.insightDecrement(x)));
 return s;
}
if(import.meta.url===`file://${process.argv[1]}`){await buildServer().connect(new StdioServerTransport());}
