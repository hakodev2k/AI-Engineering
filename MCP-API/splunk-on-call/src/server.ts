import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, type Config } from './config.js';
import { SplunkOnCallClient } from './client.js';
import { authorize } from './policy.js';

const id=z.string().min(1).max(200).regex(/^[A-Za-z0-9._:@-]+$/); const approval=z.string().regex(/^[a-f0-9]{64}$/).optional();
const out=(data:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({untrustedProviderData:true,data},null,2)}]});
export function createServer(config:Config=loadConfig(),client=new SplunkOnCallClient(config)){
 const s=new McpServer({name:'splunk-on-call-connector',version:'1.0.0'});
 s.tool('splunk_on_call.incident.list','List current open, acknowledged, and recently resolved incidents. READ.',{},async()=>out(await client.request('/api-public/v1/incidents')));
 s.tool('splunk_on_call.incident.get','Get one incident by incident number. READ.',{incidentNumber:id},async a=>out(await client.request(`/api-public/v1/incidents/${encodeURIComponent(a.incidentNumber)}`)));
 s.tool('splunk_on_call.alert.get','Get alert details by alert UUID. READ.',{uuid:id},async a=>out(await client.request(`/api-public/v1/alerts/${encodeURIComponent(a.uuid)}`)));
 s.tool('splunk_on_call.user.list','List organization users. READ.',{},async()=>out(await client.request('/api-public/v1/user')));
 s.tool('splunk_on_call.user.get','Get one user. READ.',{username:id},async a=>out(await client.request(`/api-public/v1/user/${encodeURIComponent(a.username)}`)));
 s.tool('splunk_on_call.team.list','List teams. READ.',{},async()=>out(await client.request('/api-public/v1/team')));
 s.tool('splunk_on_call.team.get','Get one team by slug. READ.',{team:id},async a=>out(await client.request(`/api-public/v1/team/${encodeURIComponent(a.team)}`)));
 s.tool('splunk_on_call.team.members.list','List members of a team. READ.',{team:id},async a=>out(await client.request(`/api-public/v1/team/${encodeURIComponent(a.team)}/members`)));
 s.tool('splunk_on_call.oncall.current','Get current on-call users and teams. READ.',{},async()=>out(await client.request('/api-public/v1/oncall/current')));
 s.tool('splunk_on_call.routing_key.list','List routing keys and associated teams. READ.',{},async()=>out(await client.request('/api-public/v1/org/routing-keys')));
 s.tool('splunk_on_call.maintenance.get','Get organization maintenance-mode state. READ.',{},async()=>out(await client.request('/api-public/v1/maintenancemode')));
 s.tool('splunk_on_call.incident.create','Create a manual incident and page specified users or escalation policies. HIGH_RISK: explicit human approval required.',{summary:z.string().min(1).max(500),details:z.string().min(1).max(10000),userName:id,targets:z.array(z.object({type:z.enum(['User','EscalationPolicy']),slug:id}).strict()).min(1).max(20),approvalToken:approval},async a=>{const intent={summary:a.summary,details:a.details,userName:a.userName,targets:a.targets};authorize(config,'splunk_on_call.incident.create',intent,a.approvalToken);return out(await client.request('/api-public/v1/incidents',{method:'POST',body:intent,retryable:false}));});
 return s;
}
if(import.meta.url===`file://${process.argv[1]}`){const s=createServer();await s.connect(new StdioServerTransport());}
