import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type {Config} from './config.js';
const ALLOWED=new Set(['ListIndexTool','IndexMappingTool','SearchIndexTool','CountTool','ClusterHealthTool','GetShardsTool','MsearchTool','ExplainTool']);
export class OpenSearchMcpClient{
 private client:Client|null=null;
 constructor(private cfg:Config){}
 async connect(){if(this.client)return; const c=new Client({name:'opensearch-safe-connector',version:'1.0.0'},{capabilities:{}}); const transport=new StreamableHTTPClientTransport(new URL(`${this.cfg.url}/_plugins/_ml/mcp`),{requestInit:{headers:this.cfg.headers}}); await Promise.race([c.connect(transport),new Promise((_,r)=>setTimeout(()=>r(new Error('OpenSearch MCP connection timeout')),this.cfg.timeoutMs))]); const listed=await c.listTools(); const names=new Set(listed.tools.map(t=>t.name)); for(const required of ALLOWED){if(!names.has(required)) throw new Error(`Required upstream MCP tool is not registered: ${required}`);} this.client=c;}
 async call(name:string,args:Record<string,unknown>){if(!ALLOWED.has(name)) throw new Error('Upstream tool is not allowlisted'); await this.connect(); return await Promise.race([this.client!.callTool({name,arguments:args}),new Promise((_,r)=>setTimeout(()=>r(new Error('OpenSearch MCP call timeout')),this.cfg.timeoutMs))]);}
 async close(){await this.client?.close();this.client=null;}
}
export const allowedUpstreamTools=()=>[...ALLOWED];
