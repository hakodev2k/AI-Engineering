import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { MotherDuckAuth } from './auth.js';
import { validateMcpUrl } from './security.js';

export const ALLOWED_UPSTREAM_TOOLS=['list_databases','list_shares','list_tables','list_columns','search_catalog','ask_docs_question','query','query_rw'] as const;
export type AllowedTool=typeof ALLOWED_UPSTREAM_TOOLS[number];
export interface Upstream { callTool(name:AllowedTool,args:Record<string,unknown>,signal?:AbortSignal):Promise<unknown>; close():Promise<void>; }
export class MotherDuckUpstream implements Upstream {
  private client?:Client;
  constructor(private auth:MotherDuckAuth,private url='https://api.motherduck.com/mcp',private timeoutMs=15000){}
  private async getClient(){ if(this.client)return this.client; const client=new Client({name:'motherduck-safe-wrapper',version:'1.0.0'}); const transport=new StreamableHTTPClientTransport(validateMcpUrl(this.url),{requestInit:{headers:this.auth.headers()}}); await client.connect(transport); const listed=await client.listTools(); const names=new Set(listed.tools.map(t=>t.name)); for(const n of ALLOWED_UPSTREAM_TOOLS) if(!names.has(n)) throw new Error(`Required trusted MotherDuck MCP tool unavailable: ${n}`); this.client=client; return client; }
  async callTool(name:AllowedTool,args:Record<string,unknown>,signal?:AbortSignal){ const c=await this.getClient(); const timeout=AbortSignal.timeout(this.timeoutMs); const combined=signal?AbortSignal.any([signal,timeout]):timeout; try{return await c.callTool({name,arguments:args},undefined,{signal:combined});}catch(e){if(combined.aborted)throw new Error('MotherDuck MCP request timed out or was cancelled');throw e;} }
  async close(){await this.client?.close();this.client=undefined;}
}
