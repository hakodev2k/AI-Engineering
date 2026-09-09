import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';
import {loadConfig} from './config.js';
import {MailerSendClient} from './client.js';
import {authorize,type Risk} from './policy.js';
const cfg=loadConfig();const api=new MailerSendClient(cfg);const server=new McpServer({name:'mailersend-connector',version:'1.0.0'});
const id=z.string().min(1).max(128);const page={limit:z.number().int().min(10).max(100).optional(),page:z.number().int().min(1).optional()};
function ok(v:unknown){return{content:[{type:'text' as const,text:JSON.stringify({provider:'mailersend',untrusted_data:true,result:v},null,2)}]}}
function reg(name:string,description:string,risk:Risk,schema:any,run:(a:any)=>Promise<any>){server.registerTool(name,{description:`${description} Risk=${risk}. ${risk==='READ'?'No approval required.':'Set approved=true only after human approval.'}`,inputSchema:schema},async(a:any)=>{try{authorize(risk,a.approved,{requireWriteApproval:cfg.requireWriteApproval,destructiveEnabled:cfg.destructiveEnabled});return ok(await run(a))}catch(e){return{isError:true,content:[{type:'text' as const,text:e instanceof Error?e.message:'Unknown error'}]}}})}
reg('mailersend.domain.list','List sending domains','READ',{...page},a=>api.request('GET','/v1/domains',undefined,a));
reg('mailersend.domain.get','Get a sending domain','READ',{domain_id:id},a=>api.request('GET',`/v1/domains/${a.domain_id}`));
reg('mailersend.template.list','List templates','READ',{...page},a=>api.request('GET','/v1/templates',undefined,a));
reg('mailersend.template.get','Get template details','READ',{template_id:id},a=>api.request('GET',`/v1/templates/${a.template_id}`));
reg('mailersend.activity.list','List email activity for a domain','READ',{domain_id:id,...page,date_from:z.number().int().optional(),date_to:z.number().int().optional()},a=>{const{domain_id,...q}=a;return api.request('GET',`/v1/activity/${domain_id}`,undefined,q)});
reg('mailersend.webhook.list','List email webhooks for a domain','READ',{domain_id:id,...page},a=>api.request('GET','/v1/webhooks',undefined,a));
reg('mailersend.webhook.create','Create an email webhook','HIGH_RISK',{domain_id:id,name:z.string().min(1).max(50),url:z.string().url().max(191).refine(v=>v.startsWith('https://'),'Webhook URL must use HTTPS'),events:z.array(z.string().min(1)).min(1).max(30),enabled:z.boolean().optional(),version:z.union([z.literal(1),z.literal(2)]).optional(),approved:z.boolean().optional()},a=>{const{approved,...body}=a;return api.request('POST','/v1/webhooks',body)});
reg('mailersend.webhook.delete','Delete an email webhook','DESTRUCTIVE',{webhook_id:id,approved:z.boolean().optional()},a=>api.request('DELETE',`/v1/webhooks/${a.webhook_id}`));
const recipient=z.object({email:z.string().email(),name:z.string().max(191).optional()});const sender=z.object({email:z.string().email(),name:z.string().max(191).optional()});
reg('mailersend.email.send','Send a transactional email','HIGH_RISK',{from:sender,to:z.array(recipient).min(1).max(50),subject:z.string().min(1).max(998),text:z.string().max(1000000).optional(),html:z.string().max(1000000).optional(),template_id:id.optional(),tags:z.array(z.string().max(50)).max(5).optional(),approved:z.boolean().optional()},a=>{const{approved,...body}=a;if(!body.text&&!body.html&&!body.template_id)throw new Error('One of text, html, or template_id is required');return api.request('POST','/v1/email',body)});
const bulkEmail=z.object({from:sender,to:z.array(recipient).min(1).max(50),subject:z.string().min(1).max(998),text:z.string().max(1000000).optional(),html:z.string().max(1000000).optional(),template_id:id.optional()});
reg('mailersend.email.bulk_send','Submit asynchronous bulk transactional emails','HIGH_RISK',{messages:z.array(bulkEmail).min(1).max(500),approved:z.boolean().optional()},a=>api.request('POST','/v1/bulk-email',a.messages));
reg('mailersend.bulk_email.get','Get bulk email processing status','READ',{bulk_email_id:id},a=>api.request('GET',`/v1/bulk-email/${a.bulk_email_id}`));
await server.connect(new StdioServerTransport());
