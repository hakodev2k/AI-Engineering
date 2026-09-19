import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type {ToolPolicy} from './policy.js';
export interface Upstream{call(policy:ToolPolicy,args:Record<string,unknown>):Promise<unknown>;close():Promise<void>}
export class RovoUpstream implements Upstream{
 private client=new Client({name:'loom-connector',version:'1.0.0'}); private connected=false; private tools=new Map<string,string>();
 constructor(private url=new URL(process.env.LOOM_MCP_URL??'https://mcp.atlassian.com/v1/mcp/preview')){}
 private async connect(){if(this.connected)return;const t=new StreamableHTTPClientTransport(this.url);await this.client.connect(t);const r=await this.client.listTools();for(const x of r.tools)this.tools.set(x.name.toLowerCase(),x.name);this.connected=true;}
 async call(policy:ToolPolicy,args:Record<string,unknown>){await this.connect();const selected=policy.upstream.map(x=>this.tools.get(x.toLowerCase())).find(Boolean);if(!selected)throw new Error(`Required Loom capability is not exposed by the connected Rovo MCP server; available tools were discovered but no allowlisted match exists.`);return this.client.callTool({name:selected,arguments:args});}
 async close(){if(this.connected)await this.client.close();}
}
