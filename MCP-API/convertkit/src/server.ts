import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';import {z} from 'zod';import {loadConfig} from './config.js';import {KitClient,qs} from './client.js';import {assertAllowed,type Risk} from './policy.js';
const cfg=loadConfig(),client=new KitClient(cfg),server=new McpServer({name:'convertkit-safe',version:'1.0.0'});const id=z.number().int().positive();const page={after:z.string().max(512).optional(),before:z.string().max(512).optional(),per_page:z.number().int().min(1).max(500).optional()};const approval=z.string().regex(/^[a-f0-9]{64}$/i).optional();
function out(data:unknown){return{content:[{type:'text' as const,text:JSON.stringify({untrusted_provider_data:true,data})}]}}
function reg(name:string,description:string,schema:any,risk:Risk,fn:(a:any)=>Promise<any>){server.tool(name,description,schema,async(a:any)=>{assertAllowed(cfg,name,risk,a);const p={...a};delete p.approval_token;return out(await fn(p))})}
reg('convertkit.subscriber.list','List Kit subscribers with bounded cursor pagination.',page,'READ',a=>client.request('GET','/subscribers'+qs(a)));
reg('convertkit.subscriber.get','Get one subscriber.',{id},'READ',a=>client.request('GET',`/subscribers/${a.id}`));
reg('convertkit.subscriber.stats','Get engagement stats for one subscriber.',{id,email_sent_after:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),email_sent_before:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()},'READ',a=>client.request('GET',`/subscribers/${a.id}/stats`+qs({email_sent_after:a.email_sent_after,email_sent_before:a.email_sent_before})));
reg('convertkit.subscriber.create','Create a subscriber.',{email_address:z.string().email().max(320),first_name:z.string().max(100).optional(),fields:z.record(z.string().max(1000)).optional(),approval_token:approval},'WRITE',a=>client.request('POST','/subscribers',a,false));
reg('convertkit.subscriber.update','Update a subscriber.',{id,first_name:z.string().max(100).optional(),email_address:z.string().email().max(320).optional(),fields:z.record(z.string().max(1000)).optional(),approval_token:approval},'WRITE',a=>{const{id,...body}=a;return client.request('PUT',`/subscribers/${id}`,body,false)});
reg('convertkit.subscriber.unsubscribe','Unsubscribe a subscriber. Destructive to active subscription state.',{id,approval_token:approval},'DESTRUCTIVE',a=>client.request('POST',`/subscribers/${a.id}/unsubscribe`,{},false));
reg('convertkit.tag.list','List tags.',page,'READ',a=>client.request('GET','/tags'+qs(a)));
reg('convertkit.tag.subscriber','Apply an existing tag to an existing subscriber.',{tag_id:id,subscriber_id:id,approval_token:approval},'WRITE',a=>client.request('POST',`/tags/${a.tag_id}/subscribers/${a.subscriber_id}`,{},false));
reg('convertkit.broadcast.list','List broadcasts.',page,'READ',a=>client.request('GET','/broadcasts'+qs(a)));
reg('convertkit.broadcast.get','Get one broadcast.',{id},'READ',a=>client.request('GET',`/broadcasts/${a.id}`));
reg('convertkit.broadcast.stats','Get broadcast performance stats.',{id},'READ',a=>client.request('GET',`/broadcasts/${a.id}/stats`));
reg('convertkit.broadcast.clicks','Get link-click analytics for a broadcast.',{id,...page},'READ',a=>client.request('GET',`/broadcasts/${a.id}/clicks`+qs({after:a.after,before:a.before,per_page:a.per_page})));
reg('convertkit.sequence.list','List email sequences.',page,'READ',a=>client.request('GET','/sequences'+qs(a)));
await server.connect(new StdioServerTransport());
