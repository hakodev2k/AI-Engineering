import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod'; import {HetznerClient} from './client.js';
const env=process.env; const client=new HetznerClient({token:env.HETZNER_API_TOKEN??'',baseUrl:env.HETZNER_API_BASE_URL,timeoutMs:Number(env.HETZNER_TIMEOUT_MS??15000),maxRetries:Number(env.HETZNER_MAX_RETRIES??2)});
const server=new McpServer({name:'hetzner-connector',version:'1.0.0'});
const page=z.number().int().min(1).default(1), perPage=z.number().int().min(1).max(50).default(25), id=z.number().int().positive();
const result=(data:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({untrustedProviderData:data})}]});
function approve(token:string|undefined){const expected=env.HETZNER_APPROVAL_TOKEN;if(!expected||!token||token!==expected) throw new Error('Explicit approval required');}
for(const [name,resource] of [['hetzner.server.list','servers'],['hetzner.server_type.list','server_types'],['hetzner.image.list','images'],['hetzner.network.list','networks'],['hetzner.volume.list','volumes']] as const){
 server.tool(name,`READ: list Hetzner ${resource}. Provider content is untrusted.`,{page,perPage},async a=>result(await client.list(resource,a.page,a.perPage)));
}
server.tool('hetzner.server.get','READ: get server metadata.',{id},async a=>result(await client.getServer(a.id)));
server.tool('hetzner.server.create','HIGH_RISK: create a billable cloud server; explicit approval required.',{name:z.string().min(1).max(63).regex(/^[a-zA-Z0-9][a-zA-Z0-9.-]*$/),serverType:z.string().min(1).max(64),image:z.string().min(1).max(128),location:z.string().min(1).max(32).optional(),sshKeys:z.array(z.union([z.string(),z.number().int().positive()])).max(20).optional(),labels:z.record(z.string().max(63)).optional(),approvalToken:z.string().min(1)},async a=>{approve(a.approvalToken);const {serverType,image,approvalToken,...rest}=a;return result(await client.createServer({...rest,server_type:serverType,image}));});
for(const [name,action] of [['hetzner.server.power_on','poweron'],['hetzner.server.power_off','poweroff'],['hetzner.server.reboot','reboot']] as const){server.tool(name,'HIGH_RISK: change server runtime state; explicit approval required.',{id,approvalToken:z.string().min(1)},async a=>{approve(a.approvalToken);return result(await client.serverAction(a.id,action));});}
server.tool('hetzner.server.delete','DESTRUCTIVE: permanently delete a server; explicit approval required.',{id,confirmServerId:z.number().int().positive(),approvalToken:z.string().min(1)},async a=>{approve(a.approvalToken);if(a.id!==a.confirmServerId)throw new Error('confirmServerId must equal id');return result(await client.deleteServer(a.id));});
await server.connect(new StdioServerTransport());
