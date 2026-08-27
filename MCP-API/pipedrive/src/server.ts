import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { PipedriveClient } from './client.js';
import { assertApproval, TOOL_POLICY } from './policy.js';

const cfg=loadConfig(); const client=new PipedriveClient(cfg); const server=new McpServer({name:'pipedrive-connector',version:'1.0.0'});
const approval=z.string().regex(/^[a-f0-9]{64}$/).optional().describe('HMAC approval token bound to tool + input');
const id=z.number().int().positive(); const limit=z.number().int().min(1).max(100).default(20);
const out=(data:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({data,untrusted_external_content:true})}]});
function checked(tool:string,input:Record<string,unknown>){assertApproval(tool,input,input.approvalId as string|undefined,cfg.approvalSecret);}

server.registerTool('pipedrive.item.search',{description:'Search CRM items by text. READ.',inputSchema:{term:z.string().min(2).max(200),item_types:z.string().max(100).optional(),limit}},async a=>out(await client.get('/v1/itemSearch',{term:a.term,item_types:a.item_types,limit:a.limit})));
server.registerTool('pipedrive.deal.get',{description:'Get one deal. READ.',inputSchema:{id}},async a=>out(await client.get(`/v1/deals/${a.id}`)));
server.registerTool('pipedrive.person.get',{description:'Get one person/contact. READ.',inputSchema:{id}},async a=>out(await client.get(`/v1/persons/${a.id}`)));
server.registerTool('pipedrive.organization.get',{description:'Get one organization. READ.',inputSchema:{id}},async a=>out(await client.get(`/v1/organizations/${a.id}`)));
server.registerTool('pipedrive.activity.list',{description:'List activities with bounded pagination. READ.',inputSchema:{start:z.number().int().min(0).default(0),limit,done:z.enum(['0','1']).optional()}},async a=>out(await client.get('/v1/activities',{start:a.start,limit:a.limit,done:a.done})));
server.registerTool('pipedrive.deal.create',{description:'Create a deal. WRITE; approval required.',inputSchema:{title:z.string().min(1).max(255),person_id:id.optional(),org_id:id.optional(),value:z.number().nonnegative().optional(),currency:z.string().regex(/^[A-Z]{3}$/).optional(),stage_id:id.optional(),approvalId:approval}},async a=>{checked('pipedrive.deal.create',a);const {approvalId,...body}=a;return out(await client.post('/v1/deals',body));});
server.registerTool('pipedrive.deal.update',{description:'Update selected deal fields. WRITE; approval required.',inputSchema:{id,title:z.string().min(1).max(255).optional(),value:z.number().nonnegative().optional(),currency:z.string().regex(/^[A-Z]{3}$/).optional(),stage_id:id.optional(),status:z.enum(['open','won','lost','deleted']).optional(),approvalId:approval}},async a=>{checked('pipedrive.deal.update',a);const {id:dealId,approvalId,...body}=a;if(!Object.keys(body).length)throw new Error('At least one update field is required');return out(await client.put(`/v1/deals/${dealId}`,body));});
server.registerTool('pipedrive.person.create',{description:'Create a person/contact. WRITE; approval required.',inputSchema:{name:z.string().min(1).max(255),email:z.string().email().optional(),phone:z.string().max(80).optional(),org_id:id.optional(),approvalId:approval}},async a=>{checked('pipedrive.person.create',a);const {approvalId,...body}=a;return out(await client.post('/v1/persons',body));});
server.registerTool('pipedrive.organization.create',{description:'Create an organization. WRITE; approval required.',inputSchema:{name:z.string().min(1).max(255),address:z.string().max(500).optional(),approvalId:approval}},async a=>{checked('pipedrive.organization.create',a);const {approvalId,...body}=a;return out(await client.post('/v1/organizations',body));});
server.registerTool('pipedrive.activity.create',{description:'Create a follow-up activity. WRITE; approval required.',inputSchema:{subject:z.string().min(1).max(255),type:z.string().min(1).max(64),due_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),due_time:z.string().regex(/^\d{2}:\d{2}$/).optional(),deal_id:id.optional(),person_id:id.optional(),org_id:id.optional(),note:z.string().max(10000).optional(),approvalId:approval}},async a=>{checked('pipedrive.activity.create',a);const {approvalId,...body}=a;return out(await client.post('/v1/activities',body));});
server.registerTool('pipedrive.webhook.list',{description:'List webhooks. READ.',inputSchema:{}},async()=>out(await client.get('/v1/webhooks')));
server.registerTool('pipedrive.webhook.create',{description:'Create a webhook subscription. HIGH_RISK; approval required.',inputSchema:{subscription_url:z.string().url().refine(v=>new URL(v).protocol==='https:','HTTPS required'),event_action:z.enum(['added','updated','deleted','*']),event_object:z.enum(['activity','deal','note','organization','person','product','user','*']),approvalId:approval}},async a=>{checked('pipedrive.webhook.create',a);const {approvalId,...body}=a;return out(await client.post('/v1/webhooks',body));});
server.registerTool('pipedrive.webhook.delete',{description:'Delete a webhook subscription. DESTRUCTIVE; approval required.',inputSchema:{id,approvalId:approval}},async a=>{checked('pipedrive.webhook.delete',a);return out(await client.delete(`/v1/webhooks/${a.id}`));});

export { server, TOOL_POLICY };
if(process.env.NODE_ENV!=='test'){await server.connect(new StdioServerTransport());}
