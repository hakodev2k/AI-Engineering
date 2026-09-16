import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { enforce, LinodeClient, loadConfig, type Risk } from './core.js';

const config=loadConfig(); const client=new LinodeClient(config); const server=new McpServer({name:'linode-safe-connector',version:'1.0.0'});
const page=z.number().int().min(1).max(10000).default(1), pageSize=z.number().int().min(25).max(500).default(100), id=z.number().int().positive(), approvalToken=z.string().regex(/^[a-f0-9]{64}$/).optional();
function output(data:unknown){return {content:[{type:'text' as const,text:JSON.stringify({untrustedProviderData:true,...(data as object)})}]};}
function reg(name:string,description:string,risk:Risk,schema:any,handler:(a:any)=>Promise<unknown>){server.tool(name,description,schema,async(a:any)=>{enforce(config,risk,name,a); return output(await handler(a));});}
reg('linode.instance.list','List Linode compute instances. READ.', 'READ',{page,pageSize},a=>client.get('/linode/instances',{page:a.page,page_size:a.pageSize}));
reg('linode.instance.get','Get one Linode instance. READ.','READ',{linodeId:id},a=>client.get(`/linode/instances/${a.linodeId}`));
reg('linode.instance.stats','Get last 24h CPU, IO, IPv4 and IPv6 stats. READ; provider limit is stricter than general API.','READ',{linodeId:id},a=>client.get(`/linode/instances/${a.linodeId}/stats`));
reg('linode.region.list','List regions. READ.','READ',{page,pageSize},a=>client.get('/regions',{page:a.page,page_size:a.pageSize}));
reg('linode.type.list','List Linode plans/types. READ.','READ',{page,pageSize},a=>client.get('/linode/types',{page:a.page,page_size:a.pageSize}));
reg('linode.volume.list','List Block Storage volumes. READ.','READ',{page,pageSize},a=>client.get('/volumes',{page:a.page,page_size:a.pageSize}));
reg('linode.firewall.list','List Cloud Firewalls. READ.','READ',{page,pageSize},a=>client.get('/networking/firewalls',{page:a.page,page_size:a.pageSize}));
reg('linode.domain.list','List DNS domains. READ.','READ',{page,pageSize},a=>client.get('/domains',{page:a.page,page_size:a.pageSize}));
for(const action of ['boot','shutdown','reboot'] as const) reg(`linode.instance.${action}`,`${action} a Linode instance. HIGH_RISK; explicit external approval required.`,'HIGH_RISK',{linodeId:id,approvalToken},a=>client.mutate('POST',`/linode/instances/${a.linodeId}/${action}`));
reg('linode.instance.delete','Permanently delete a Linode instance. DESTRUCTIVE; disabled by default and exact approval required.','DESTRUCTIVE',{linodeId:id,confirm:z.string(),approvalToken},a=>{if(a.confirm!==`DELETE LINODE ${a.linodeId}`) throw new Error('CONFIRMATION_MISMATCH'); return client.mutate('DELETE',`/linode/instances/${a.linodeId}`)});
await server.connect(new StdioServerTransport());
